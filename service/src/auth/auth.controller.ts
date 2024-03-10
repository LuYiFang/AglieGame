import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('validateToken')
  validateToken(@Payload() token: string) {
    return this.authService.validateToken(token);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const jwt = await this.authService.login(
      res,
      loginDto.username,
      loginDto.password,
    );
    res.cookie('token', jwt, { maxAge: 60 * 60 * 1000 });
    return loginDto.username;
  }

  @Post('signup')
  @ApiBody({ type: LoginDto })
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const jwt = await this.authService.signup(loginDto);
    res.cookie('token', jwt, { maxAge: 60 * 60 * 1000 });
    return loginDto.username;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout();
    res.clearCookie('token');
  }
}
