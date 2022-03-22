import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class UserService {
  createUser(): Observable<any> {
    return of({});
  }
}
