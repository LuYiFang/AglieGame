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

@Injectable()
export class UserService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async queryUser(username: string): Promise<Record<string, any> | null> {
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

    return { id: userObject.elementId };
  }

  async findUser(username: string): Promise<Record<string, any>> {
    const user = this.queryUser(username);
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
      const hashedPassword = await bcrypt.hash(user.password, 10);
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
      console.log('rrrr', error);
      throw new BadRequestException('Failed to create user', { cause: error });
    }
  }
}
