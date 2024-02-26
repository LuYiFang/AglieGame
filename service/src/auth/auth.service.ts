import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly neo4jService: Neo4jService,
    // private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.neo4jService.read(
      `MATCH (u:User {username: $username}) RETURN u`,
      { username },
    );
    if (!user) {
      return false;
    }

    const userObject = user.records[0]?.get('u')?.properties;
    if (!userObject) throw new NotFoundException('User not found.');

    const isValidPassword = await bcrypt.compare(password, userObject.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    return userObject;
  }

  createJWT(payload) {}

  login(res: Response, username: string, id: string) {
    const payload = { username, id };
    // res.setCookie('token', )
  }
}
