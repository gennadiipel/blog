import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../DTOs/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { UserResponseInterface } from '../types/user-response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  createUser(createUserDTO: CreateUserDTO): Observable<UserEntity> {
    const newUser: UserEntity = new UserEntity();
    Object.assign(newUser, createUserDTO);
    return from(this._userRepository.save(newUser));
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }

  generateJWT(user: UserEntity): string {
    return sign(
      {
        username: user.username,
        email: user.email,
        id: user.id,
      },
      JWT_SECRET,
    );
  }
}
