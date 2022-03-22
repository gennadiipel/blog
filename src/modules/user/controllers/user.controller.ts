import { Body, Controller, Post } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CreateUserDTO } from '../DTOs/create-user.dto';
import { UserService } from '../services/user.service';
import { UserResponseInterface } from '../types/user-response.interface';

@Controller()
export class UserController {
  constructor(private _userService: UserService) {}

  @Post('users')
  createUser(
    @Body('user') createUserDTO: CreateUserDTO,
  ): Observable<UserResponseInterface> {
    return this._userService.createUser(createUserDTO).pipe(
      map((userResponse) => {
        return this._userService.buildUserResponse(userResponse);
      }),
    );
  }
}
