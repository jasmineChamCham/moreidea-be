import { ApiProperty } from '@nestjs/swagger';

export class MentorQuoteDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  quote: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  meaning: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}
