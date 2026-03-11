import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UploadMediaCommand } from './uploadMedia.command';
import { UploadMediaRequestBody } from './uploadMedia.request-body';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadMediaResponse } from './uploadMedia.response';

const MAX_NUMBER_OF_FILES = 10;

const UPLOAD_FILES_SCHEMA = {
  type: 'object',
  required: ['files', 'sessionId'],
  properties: {
    files: {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
      maxItems: MAX_NUMBER_OF_FILES,
      description: `Media files to upload (images or videos, maximum ${MAX_NUMBER_OF_FILES} files)`,
    },
    sessionId: {
      type: 'string',
      format: 'uuid',
      description: 'Analysis session ID',
      example: 'a6200f4f-a4b6-4a68-b221-5571fdc76a3a',
    },
  },
};

@ApiTags('File')
@Controller({
  path: 'files',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class UploadMediaEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Upload multiple media files (images/videos)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: UPLOAD_FILES_SCHEMA })
  @Post()
  @UseInterceptors(FilesInterceptor('files', MAX_NUMBER_OF_FILES))
  public create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UploadMediaRequestBody,
  ): Promise<UploadMediaResponse[]> {
    return this.commandBus.execute<UploadMediaCommand, UploadMediaResponse[]>(
      new UploadMediaCommand(files, body.sessionId),
    );
  }
}
