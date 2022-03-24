import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { map, Observable, of } from 'rxjs';
import { User } from '../decorators/user.decorator';
import { CreateUserDTO } from '../DTOs/create-user.dto';
import { LoginUserDTO } from '../DTOs/login-user.dto';
import { UserEntity } from '../entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';
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

  @Get('user')
  @UseGuards(AuthGuard)
  getCurrentUser(@User() user: UserEntity): Observable<UserResponse> {
    // console.log(request.user);
    return of(this._userService.buildUserResponse(user));
  }
}
