import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomExpressRequest } from 'src/types/custom-express-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: CustomExpressRequest = context
      .switchToHttp()
      .getRequest<CustomExpressRequest>();

    if (request.user) {
      return true;
    }

    throw new HttpException('You must be logged in', HttpStatus.UNAUTHORIZED);
  }
}
