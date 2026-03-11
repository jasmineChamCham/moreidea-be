import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMentorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  style: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bgVibe?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cameraAngle?: string;
}

export class CreateMentorCommand {
  constructor(public readonly dto: CreateMentorDto) {}
}
