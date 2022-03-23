import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CreateUserDTO } from '../DTOs/create-user.dto';
import { LoginUserDTO } from '../DTOs/login-user.dto';
import { UserService } from '../services/user.service';
import { UserResponse } from '../types/user-response.interface';

@Controller()
export class UserController {
  constructor(private _userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  createUser(
    @Body('user') createUserDTO: CreateUserDTO,
  ): Observable<UserResponse> {
    return this._userService.createUser(createUserDTO).pipe(
      map((userResponse) => {
        return this._userService.buildUserResponse(userResponse);
      }),
    );
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  loginUser(
    @Body('user') loginUserDTO: LoginUserDTO,
  ): Observable<UserResponse> {
    return this._userService
      .loginUser(loginUserDTO)
      .pipe(map((user) => this._userService.buildUserResponse(user)));
  }
}
