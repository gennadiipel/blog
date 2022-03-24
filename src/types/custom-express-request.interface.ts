import { Request } from 'express';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export interface CustomExpressRequest extends Request {
  user?: UserEntity;
}
