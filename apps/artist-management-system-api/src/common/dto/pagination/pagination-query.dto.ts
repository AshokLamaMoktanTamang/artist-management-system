import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsPositive()
  @IsOptional()
  readonly limit?: number;

  @Min(0)
  @IsOptional()
  readonly page?: number;
}
