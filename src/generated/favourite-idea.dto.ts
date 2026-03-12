import { ApiProperty } from '@nestjs/swagger';

export class FavouriteIdeaDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  person: string;
  @ApiProperty({
    type: 'string',
  })
  quote: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  place: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  photoUrl: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
