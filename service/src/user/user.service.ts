import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/user.interface';
import { Neo4jService } from 'nest-neo4j/dist';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { HandleNeo4jResult } from '../common/decorators/extract-neo4j-record.decorator';
import { Neo4jExtractSingle } from 'src/common/interfaces/common.interface';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createUserUniqueConstraint();
  }

  async createUserUniqueConstraint() {
    try {
      await this.neo4jService.write(
        `
        CREATE CONSTRAINT userUsernameUnique IF NOT EXISTS FOR (u:User) REQUIRE u.username IS UNIQUE
        `,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error when init database', {
        cause: error,
      });
    }
  }

  @HandleNeo4jResult(false)
  async queryUser(username: string): Neo4jExtractSingle {
    return await this.neo4jService.read(
      `MATCH (u:User {username: $username}) RETURN u`,
      { username },
    );
  }

  async getUser(
    username: string,
    properties: Array<string> = ['id'],
  ): Promise<{ [key: string]: any } | null> {
    const data = await this.queryUser(username);
    if (!data) return null;

    return _.pick(data, properties);
  }

  async findUser(
    username: string,
    properties: Array<string> = [],
  ): Promise<Record<string, any>> {
    const user = await this.getUser(username, properties);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async checkUserExist(username: string): Promise<boolean> {
    const user = await this.getUser(username);
    if (!user) {
      return false;
    }
    return true;
  }

  async createUser(
    user: User,
  ): Promise<{ id: string; username: string; msg: string }> {
    try {
      const hashedPassword = await bcrypt.hash(
        user.password,
        parseInt(this.configService.get('BCRYPT_ROUND')),
      );
      const userObject = await this.neo4jService.write(
        `CREATE (u:User {username: $username, password: $password}) RETURN u;`,
        { username: user.username, password: hashedPassword },
      );
      return {
        id: userObject.records[0]?.get('u')?.elementId,
        username: user.username,
        msg: 'User created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Failed to create user', { cause: error });
    }
  }
}
