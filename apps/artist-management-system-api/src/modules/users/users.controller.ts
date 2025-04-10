import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ActiveUser } from '@/common/decorators/active-user.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('whoami')
  async whoAmI(@ActiveUser('id') userId: string) {
    return this.usersService.findById(userId, { password: 0 });
  }
}
