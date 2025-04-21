import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { USER_ROLE } from './interfaces';
import { PaginationQueryDto } from '@/common/dto/pagination/pagination-query.dto';
import { SignupDto } from '../auth/dto/auth.dto';

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

  @Roles(USER_ROLE.SUPER_ADMIN, USER_ROLE.ARTIST_MANAGER)
  @Get('detail/:id')
  async getUserDetail(
    @Param('id') userId: string,
    @ActiveUser('role') userRole: USER_ROLE
  ) {
    const data = await this.usersService.findById(userId, {
      password: 0,
      deleted: 0,
      deleted_at: 0,
    });

    if (
      (userRole === USER_ROLE.ARTIST_MANAGER &&
        data?.role !== USER_ROLE.ARTIST) ||
      userRole === USER_ROLE.ARTIST
    )
      throw new BadRequestException(
        'User not allowed to get detail of this user'
      );

    return data;
  }

  @Roles(USER_ROLE.SUPER_ADMIN)
  @Get('all')
  async getAllUsers(
    @ActiveUser('id') userId: string,
    @Query() paginationData: PaginationQueryDto
  ) {
    return this.usersService.findAllUsers(userId, paginationData);
  }

  @Roles(USER_ROLE.ARTIST_MANAGER, USER_ROLE.SUPER_ADMIN)
  @Get('artists')
  async getAllArtists(
    @ActiveUser('id') userId: string,
    @Query() paginationData: PaginationQueryDto
  ) {
    return this.usersService.findAllUsers(userId, {
      ...paginationData,
      role: USER_ROLE.ARTIST,
    });
  }

  @Roles(USER_ROLE.SUPER_ADMIN)
  @Delete(':userId')
  async deleteUser(
    @ActiveUser('id') adminId: string,
    @Param('userId') userId: string
  ) {
    if (adminId === userId)
      throw new BadRequestException('Unable to delete User');

    return this.usersService.deleteById(userId);
  }

  @Roles(USER_ROLE.SUPER_ADMIN, USER_ROLE.ARTIST_MANAGER)
  @Post('')
  async addUser(
    @ActiveUser('role') userRole: USER_ROLE,
    @Body() createUserDto: SignupDto
  ) {
    const { role } = createUserDto;

    if (
      (userRole === USER_ROLE.ARTIST_MANAGER && role !== USER_ROLE.ARTIST) ||
      userRole === USER_ROLE.ARTIST
    )
      throw new BadRequestException(
        'User not allowed to create user of this role'
      );

    return this.usersService.addUser(createUserDto);
  }

  @Roles(USER_ROLE.SUPER_ADMIN, USER_ROLE.ARTIST_MANAGER)
  @Patch(':userId')
  async updateUser(
    @ActiveUser('role') userRole: USER_ROLE,
    @Body() updateUserDto: Partial<Omit<SignupDto, 'password'>>,
    @Param('userId') userId: string
  ) {
    const { role } = updateUserDto;

    if (
      (userRole === USER_ROLE.ARTIST_MANAGER && role !== USER_ROLE.ARTIST) ||
      userRole === USER_ROLE.ARTIST
    )
      throw new BadRequestException(
        'User not allowed to update user of this role'
      );

    return this.usersService.updateUser({ ...updateUserDto, userId });
  }
}
