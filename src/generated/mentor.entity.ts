
import {ApiProperty} from '@nestjs/swagger'


export class MentorEntity {
  @ApiProperty({
  type: 'string',
})
id: string ;
@ApiProperty({
  type: 'string',
})
name: string ;
@ApiProperty({
  type: 'string',
})
style: string ;
@ApiProperty({
  type: 'string',
  nullable: true,
})
bgVibe: string  | null;
@ApiProperty({
  type: 'string',
  nullable: true,
})
cameraAngle: string  | null;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
createdAt: Date ;
@ApiProperty({
  type: 'string',
  format: 'date-time',
})
updatedAt: Date ;
}
