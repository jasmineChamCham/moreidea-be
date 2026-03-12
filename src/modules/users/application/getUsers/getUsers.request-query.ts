import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, RoleType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { GetUsersOrderByEnum } from '../../user.enum';
import { IsOrderQueryParam } from 'src/common/decorator/order.decorator';

export class GetUsersRequestQuery {
  @ApiPropertyOptional({
    description: 'Search by display name or email',
    example: 'Tram',
  })
  @IsOptional()
  @IsString()
  search?: string | null;

  @ApiPropertyOptional({
    description: 'Filter by roles',
    example: Object.values(RoleType).join(', '),
    type: String,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsEnum(RoleType, { each: true })
  roleTypes: RoleType[];

  @ApiPropertyOptional({
    description: 'Number of records to skip and then return the remainder',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({
    description: 'Number of records to return and then skip over the remainder',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number = 10;

  @ApiPropertyOptional({
    description: `Order by keyword. \n\n  Available values: ${Object.values(
      GetUsersOrderByEnum,
    )}`,
    example: `${GetUsersOrderByEnum.email}:${Prisma.SortOrder.asc}`,
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetUsersOrderByEnum)
  order?: string;
}
