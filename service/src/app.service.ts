import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly neo4jService: Neo4jService) {}

  async onModuleInit() {
    await this.createUniqueConstraint();
  }

  async createUniqueConstraint() {
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

  getHello(): string {
    return 'Hello World!';
  }
}
