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
import { UserService } from '../user/user.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // @UseGuards(AuthGuard('local'))
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
    res.cookie('token', jwt);
    return loginDto.username;
  }

  @Post('signup')
  @ApiBody({ type: LoginDto })
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const jwt = await this.authService.signup(loginDto);
    res.cookie('token', jwt);
    return loginDto.username;
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logout()
    res.clearCookie('token');
  }
}
