import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';

export class UploadMediaResponse {
  @ApiProperty({ example: 'a6200f4f-a4b6-4a68-b221-5571fdc76a3a' })
  id: string;

  @ApiProperty({ example: 'a6200f4f-a4b6-4a68-b221-5571fdc76a3a' })
  sessionId: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  })
  filePath: string;

  @ApiProperty({ enum: FileType, example: FileType.image })
  fileType: FileType;

  @ApiProperty({ example: 'sample.jpg' })
  fileName: string;

  @ApiProperty({ example: 0 })
  orderIndex: number;

  @ApiProperty({ example: '2024-01-24T09:48:49.000Z' })
  createdAt: Date;
}
