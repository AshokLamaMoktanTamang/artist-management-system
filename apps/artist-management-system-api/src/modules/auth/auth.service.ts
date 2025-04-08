import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { USER_GENDER, USER_ROLE } from '../users/interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registerUser() {
    return this.usersService.create({
      email: 'ashok.lama+kq@innovatetech.co',
      dob: new Date(),
      first_name: 'Ashok',
      last_name: 'Lama',
      gender: USER_GENDER.MALE,
      password: '1234',
      phone: '+977 98989898',
      role: USER_ROLE.SUPER_ADMIN,
    });
  }
}
