import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { from, map, Observable, of } from 'rxjs';
import { CustomExpressRequest } from 'src/types/custom-express-request.interface';
import { CreateUserDTO } from '../DTOs/create-user.dto';
import { LoginUserDTO } from '../DTOs/login-user.dto';
import { UserEntity } from '../entities/user.entity';
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
  getCurrentUser(
    @Req() request: CustomExpressRequest,
  ): Observable<UserResponse> {
    // console.log(request.user);
    return of(this._userService.buildUserResponse(request.user));
  }
}
