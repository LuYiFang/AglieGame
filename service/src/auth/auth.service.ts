import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUser(username, [
      'username',
      'password',
    ]);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    return { username: user.username, id: user.id };
  }

  createJWT(username: string, id: string) {
    return this.jwtService.sign({ username, id });
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async login(res: Response, username: string, password: string) {
    const { username: validUsername, id } = await this.validateUser(
      username,
      password,
    );
    return this.createJWT(validUsername, id);
  }

  async signup(loginDto: LoginDto) {
    const userExist = await this.userService.checkUserExist(loginDto.username);
    if (userExist) {
      throw new BadRequestException('Username already exist.');
    }

    const { username, id } = await this.userService.createUser(loginDto);
    const jwt = this.createJWT(username, id);
    return jwt;
  }

  async logout() {
    // do some logout thing
  }
}
