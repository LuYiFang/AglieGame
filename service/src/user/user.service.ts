import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/user.interface';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class UserService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createUser(user: User): Promise<String> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await this.neo4jService.write(
        `CREATE CONSTRAINT ON (u:User) ASSERT u.username IS UNIQUE
        MERGE (u:User {username: $username, password: $password}) RETURN u`,
        { username: user.username, password: hashedPassword },
      );
      return 'User created successfully';
    } catch (error) {
      throw new BadRequestException('Failed to create user', { cause: error });
    }
  }
}
