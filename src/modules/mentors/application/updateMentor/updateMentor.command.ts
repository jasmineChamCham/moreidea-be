import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMentorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  style?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bgVibe?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cameraAngle?: string;
}

export class UpdateMentorCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateMentorDto,
  ) {}
}
