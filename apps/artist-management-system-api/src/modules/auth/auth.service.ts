import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registerUser(data: SignupDto) {
    const { email, role } = data;
    const existingUser = await this.usersService.findOne({ email, role });

    if (existingUser)
      throw new ConflictException('User with role already exist');

    return this.usersService.create(data);
  }
}
