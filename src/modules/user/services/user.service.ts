import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, mergeMap, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../DTOs/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { UserResponse } from '../types/user-response.interface';
import { LoginUserDTO } from '../DTOs/login-user.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  createUser(createUserDTO: CreateUserDTO): Observable<UserEntity> {
    const newUser: UserEntity = new UserEntity();

    return this.findOneByEmail(createUserDTO.email).pipe(
      mergeMap((user) => {
        if (user) {
          throw new HttpException(
            'Email is already taken',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        return this.findOneByUsername(createUserDTO.username);
      }),
      mergeMap((user) => {
        console.log(user);

        if (user) {
          throw new HttpException(
            'Username is already taken',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        Object.assign(newUser, createUserDTO);

        return from(this._userRepository.save(newUser));
      }),
    );
  }

  loginUser(loginUserDTO: LoginUserDTO): Observable<UserEntity> {
    return this.findOneByUsername(loginUserDTO.username).pipe(
      mergeMap((user) => {
        if (!user) {
          throw new HttpException(
            'User was not found',
            HttpStatus.UNAUTHORIZED,
          );
        }

        return from(compare(loginUserDTO.password, user.password)).pipe(
          map((isPasswordCorrect: boolean) => {
            if (!isPasswordCorrect) {
              throw new HttpException(
                'Password incorrect',
                HttpStatus.UNAUTHORIZED,
              );
            }

            delete user.password;

            return user;
          }),
        );
      }),
    );
  }

  findOneByEmail(email: string): Observable<UserEntity> {
    return from(this._userRepository.findOne({ email }));
  }

  findOneByUsername(username: string): Observable<UserEntity> {
    return from(
      this._userRepository.findOne(
        {
          username,
        },
        { select: ['id', 'username', 'email', 'image', 'status', 'password'] },
      ),
    );
  }

  findById(id: number): Observable<UserEntity> {
    return from(this._userRepository.findOne({ id }));
  }

  buildUserResponse(user: UserEntity): UserResponse {
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
