import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { FindUserDto } from 'src/users/dto/find-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    console.log(loginDto);

    const findUserDto: FindUserDto = {};

    if (loginDto.emailOrUsername.includes('@')) {
      findUserDto.email = loginDto.emailOrUsername;
    } else {
      findUserDto.username = loginDto.emailOrUsername;
    }

    console.log(findUserDto);

    const user = await this.usersService.findOne(findUserDto);

    console.log(user);
    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: user._id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
