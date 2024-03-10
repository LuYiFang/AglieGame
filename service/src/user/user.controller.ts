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
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FindUser, User } from './interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('findUser')
  async findUser(@Payload() data: FindUser) {
    return await this.userService.findUser(data.username, data.properties);
  }

  @MessagePattern('checkUserExist')
  async checkUserExist(@Payload() username: string) {
    return await this.userService.checkUserExist(username);
  }

  @MessagePattern('createUser')
  async createUser(@Payload() data: User) {
    return await this.userService.createUser(data);
  }
}
