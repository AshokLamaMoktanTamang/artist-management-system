import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../pagination/pagination.dto';
import { BaseResponseDto } from './base-response.dto';

export class PaginationResponseDto<T> extends BaseResponseDto {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  pagination: PaginationDto;

  constructor(data: T[], pagination: PaginationDto) {
    super();
    this.data = data;
    this.pagination = pagination;
  }
}
