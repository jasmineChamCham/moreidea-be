
import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty,IsOptional,IsString} from 'class-validator'




export class CreateFavouriteIdeaDto {
  @ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
person: string ;
@ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
quote: string ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
@IsOptional()
@IsString()
place?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
@IsOptional()
@IsString()
photoUrl?: string  | null;
}
