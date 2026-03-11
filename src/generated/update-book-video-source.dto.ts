
import {SourceType} from '@prisma/client'
import {ApiProperty} from '@nestjs/swagger'
import {IsEnum,IsOptional,IsString} from 'class-validator'




export class UpdateBookVideoSourceDto {
  @ApiProperty({
  type: 'string',
  required: false,
})
@IsOptional()
@IsString()
sourceTitle?: string ;
@ApiProperty({
  enum: SourceType,
  enumName: 'SourceType',
  required: false,
})
@IsOptional()
@IsEnum(SourceType)
sourceType?: SourceType ;
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
