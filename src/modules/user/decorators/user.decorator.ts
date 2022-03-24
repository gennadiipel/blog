import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomExpressRequest } from 'src/types/custom-express-request.interface';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request: CustomExpressRequest = ctx
    .switchToHttp()
    .getRequest<CustomExpressRequest>();

  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
