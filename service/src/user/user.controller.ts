import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
