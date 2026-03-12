import { ApiProperty } from '@nestjs/swagger';

export class MentorDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  philosophy: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  mindset: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  style: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  speakingStyle: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  bodyLanguage: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  bio: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  era: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  archetype: string | null;
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
