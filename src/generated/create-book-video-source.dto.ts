
import {SourceType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import {IsEnum,IsNotEmpty,IsOptional,IsString} from 'class-validator'




export class CreateBookVideoSourceDto {
  @ApiProperty({
  type: 'string',
})
@IsNotEmpty()
@IsString()
sourceTitle: string ;
@ApiProperty({
  enum: SourceType,
  enumName: 'SourceType',
})
@IsNotEmpty()
@IsEnum(SourceType)
sourceType: SourceType ;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
@IsOptional()
@IsString()
creator?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
@IsOptional()
@IsString()
sourceUrl?: string  | null;
@ApiProperty({
  type: 'string',
  required: false,
  nullable: true,
})
@IsOptional()
@IsString()
filePath?: string  | null;
}
