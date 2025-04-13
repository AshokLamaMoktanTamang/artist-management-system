import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { USER_ROLE } from './interfaces';
import { PaginationQueryDto } from '@/common/dto/pagination/pagination-query.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('whoami')
  async whoAmI(@ActiveUser('id') userId: string) {
    return this.usersService.findById(userId, {
      password: 0,
      deleted: 0,
      deleted_at: 0,
    });
  }

  @Roles(USER_ROLE.SUPER_ADMIN)
  @Get('all')
  async getAllUsers(
    @ActiveUser('id') userId: string,
    @Query() paginationData: PaginationQueryDto
  ) {
    return this.usersService.findAllUsers(userId, paginationData);
  }
}
