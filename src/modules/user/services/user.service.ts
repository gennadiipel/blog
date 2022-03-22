import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateUserDTO } from '../DTOs/create-user.dto';

@Injectable()
export class UserService {
  createUser(createUserDTO: CreateUserDTO): Observable<any> {
    return of(createUserDTO);
  }
}
