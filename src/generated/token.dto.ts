import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  deviceId: string;
  @ApiProperty({
    type: 'string',
  })
  refreshToken: string;
}
