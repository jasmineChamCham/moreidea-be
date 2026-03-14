import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class GenerateQuoteFromImageDto {
  @ApiProperty({
    type: 'string',
    description: 'The URL of the image to extract quote from',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imageUrl: string;
}

export class GenerateQuoteFromImageResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'The extracted quote from the image',
  })
  quote: string;
}
