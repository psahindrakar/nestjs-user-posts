import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
  ) {
    return this.userService.createUser(firstname, lastname);
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }
}
