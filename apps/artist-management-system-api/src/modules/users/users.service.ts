import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PaginationQueryDto } from '@/common/dto/pagination/pagination-query.dto';
import { PaginationDto } from '@/common/dto/pagination/pagination.dto';
import { PaginationResponseDto } from '@/common/dto/response/pagination-response.dto';

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
}
