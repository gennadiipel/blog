import { IsEmail } from 'class-validator';

export class UpdateUserDTO {
  @IsEmail()
  email: string;

  status: string;

  image: string;
}
