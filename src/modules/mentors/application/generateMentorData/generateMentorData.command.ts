import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateMentorDataDto {
  @ApiProperty({
    description: 'The name of the mentor to generate data for',
    example: 'Seneca',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class GenerateMentorDataCommand {
  constructor(public readonly dto: GenerateMentorDataDto) {}
}
