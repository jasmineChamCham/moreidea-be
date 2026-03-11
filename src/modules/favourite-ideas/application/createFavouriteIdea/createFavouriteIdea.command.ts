import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavouriteIdeaDto {
  @ApiProperty()
  @IsString()
  person: string;

  @ApiProperty()
  @IsString()
  quote: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  place?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class CreateFavouriteIdeaCommand {
  constructor(public readonly dto: CreateFavouriteIdeaDto) {}
}
