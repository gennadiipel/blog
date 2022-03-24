import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { of, switchMap } from 'rxjs';
import { JWT_SECRET } from 'src/config';
import { CustomExpressRequest } from 'src/types/custom-express-request.interface';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private _userService: UserService) {}

  use(request: CustomExpressRequest, response: Response, next: NextFunction) {
    if (!request.headers.authorization) {
      request.user = null;
      next();
      return;
    }

    const token = request.headers.authorization;

    let decoded = null;
    try {
      decoded = verify(token, JWT_SECRET);

      of(decoded)
        .pipe(
          switchMap((decoded: any) => this._userService.findById(decoded.id)),
        )
        .subscribe({
          next: (user: UserEntity) => {
            request.user = user;
          },
          error: () => {
            request.user = null;
          },
        })
        .add(() => next());
    } catch {
      request.user = null;
      next();
    }
  }
}
