import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/user.interface';
import { Neo4jService } from 'nest-neo4j/dist';
import _ from 'lodash';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly configService: ConfigService,
  ) {}

  async queryUser(
    username: string,
    properties: Array<string> = [],
  ): Promise<{ [key: string]: any } | null> {
    const user = await this.neo4jService.read(
      `MATCH (u:User {username: $username}) RETURN u`,
      { username },
    );
    if (!user) {
      return null;
    }

    const userObject = user.records[0]?.get('u');
    if (!userObject) return null;

    const userProperties = userObject.properties;
    if (!userProperties) return null;

    return { id: userObject.elementId, ..._.pick(userProperties, properties) };
  }

  async findUser(
    username: string,
    properties: Array<string> = [],
  ): Promise<Record<string, any>> {
    const user = await this.queryUser(username, properties);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async checkUserExist(username: string): Promise<boolean> {
    const user = await this.queryUser(username);
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
