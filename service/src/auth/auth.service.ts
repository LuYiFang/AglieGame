import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto } from './dto/auth.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('APP_SERVICE') private readonly client: ClientProxy,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await firstValueFrom(
      this.client.send('findUser', {
        username,
        properties: ['id', 'username', 'password'],
      }),
    );

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
    const jwt = this.createJWT(validUsername, id);
  }

  async signup(loginDto: LoginDto) {
    const userExist = await firstValueFrom(
      this.client.send('checkUserExist', loginDto.username),
    );

    if (userExist) {
      throw new BadRequestException('Username already exist.');
    }

    const { username, id } = await firstValueFrom(
      this.client.send('createUser', loginDto),
    );
    const jwt = this.createJWT(username, id);
  }

  async logout() {
    // do some logout thing
  }
}
