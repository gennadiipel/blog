import { Controller, Post } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller()
export class UserController {
  @Post('users')
  createUser(): Observable<any> {
    return of({});
  }
}
