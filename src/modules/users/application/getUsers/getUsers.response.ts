import { ApiProperty } from '@nestjs/swagger';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';
import { UserDto } from 'src/generated/user.dto';

export type GetUsersResponse = Partial<UserDto>;
export class GetUsersQueryResponse extends PaginatedOutputDto<GetUsersResponse> {
  @ApiProperty({
    description: 'List of users',
    isArray: true,
  })
  data: GetUsersResponse[];
}
