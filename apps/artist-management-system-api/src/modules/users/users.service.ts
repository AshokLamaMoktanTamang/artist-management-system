import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PaginationQueryDto } from '@/common/dto/pagination/pagination-query.dto';
import { PaginationDto } from '@/common/dto/pagination/pagination.dto';
import { PaginationResponseDto } from '@/common/dto/response/pagination-response.dto';
import { SignupDto } from '../auth/dto/auth.dto';
import { IUpdateUser } from './interfaces';

@Injectable()
export class UsersService extends UsersRepository {
  async findAllUsers(
    userId: string,
    { limit = 10, page = 1 }: PaginationQueryDto
  ) {
    page = Math.max(0, page - 1);

    const filter = { id: { $ne: userId } } as any;

    const [totalUsers, users] = await Promise.all([
      this.count(filter),
      this.find({
        where: filter,
        limit,
        offset: page * limit,
        orderBy: 'first_name',
        orderDirection: 'ASC',
      }),
    ]);

    const pagination = new PaginationDto(
      totalUsers,
      Math.ceil(totalUsers / limit),
      page
    );
    const paginatedUserResponse = new PaginationResponseDto(users, pagination);

    return paginatedUserResponse;
  }

  async addUser(data: SignupDto) {
    const { email, role } = data;
    const existingUser = await this.findOne({ email, role });

    if (existingUser)
      throw new ConflictException('User with role already exist');

    return this.create(data);
  }

  async updateUser({ userId, ...data }: IUpdateUser) {
    const { email, role } = data;
    const existingUser = await this.findOne({ email, role });

    if (existingUser)
      throw new ConflictException('User with role already exist');

    return this.updateById(userId, data);
  }
}
