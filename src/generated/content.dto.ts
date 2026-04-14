import { ApiProperty } from '@nestjs/swagger';

export class ContentDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: 'string',
  })
  platform: string;
  @ApiProperty({
    type: 'string',
  })
  content: string;
  @ApiProperty({
    type: 'string',
  })
  analysis: string;
  @ApiProperty({
    type: 'string',
  })
  bodyLanguage: string;
  @ApiProperty({
    type: 'string',
  })
  toneVoice: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  score: number;
  @ApiProperty({
    type: 'string',
  })
  topic: string;
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
