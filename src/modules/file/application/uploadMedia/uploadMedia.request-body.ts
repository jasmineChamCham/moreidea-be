import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UploadMediaRequestBody {
  @ApiProperty({
    description: 'Analysis session ID',
    example: 'a6200f4f-a4b6-4a68-b221-5571fdc76a3a',
  })
  @IsUUID()
  sessionId: string;
}
