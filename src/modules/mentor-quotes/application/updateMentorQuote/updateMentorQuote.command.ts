import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMentorQuoteDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  quote?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  meaning?: string;
}

export class UpdateMentorQuoteCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateMentorQuoteDto,
  ) {}
}
