import { Body, Controller, Post } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateUserDTO } from '../DTOs/create-user.dto';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
  constructor(private _userService: UserService) {}

  @Post('users')
  createUser(@Body('user') createUserDTO: CreateUserDTO): Observable<any> {
    return this._userService.createUser(createUserDTO);
  }
}
