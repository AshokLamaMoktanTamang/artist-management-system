import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({
    type: 'number',
    default: 200,
  })
  statusCode?: number;

  @ApiProperty({
    type: 'boolean',
    default: true,
  })
  isSuccess?: boolean;

  @ApiPropertyOptional({
    type: 'string',
  })
  message?: string;
}

export class BaseCreateResponseDto extends BaseResponseDto {
  @ApiProperty({
    type: 'string',
    default: 201,
  })
  override statusCode?: number;
}
