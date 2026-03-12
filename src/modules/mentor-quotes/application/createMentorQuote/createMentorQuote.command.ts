import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMentorQuoteDto {
  @ApiProperty()
  @IsString()
  quote: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  meaning?: string;
}

export class CreateMentorQuoteCommand {
  constructor(
    public readonly mentorId: string,
    public readonly dto: CreateMentorQuoteDto,
  ) {}
}
