import { ApiProperty } from '@nestjs/swagger';
import { MentorEntity } from './mentor.entity';

export class QuoteEntity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  mentorId: string;
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
    type: () => MentorEntity,
    required: false,
  })
  mentor?: MentorEntity;
}
