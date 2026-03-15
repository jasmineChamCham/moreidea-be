import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBookSourceCommand } from './createBookSource.command';
import { Express } from 'express';

@ApiTags('Sources')
@Controller({ path: 'sources', version: '1' })
export class CreateBookSourceEndpoint {
  constructor(protected commandBus: CommandBus) { }

  @ApiOperation({ description: 'Upload a PDF book, extract ideas via Gemini' })
  @ApiConsumes('multipart/form-data')
  @Post('book')
  @UseInterceptors(FileInterceptor('file'))
  public create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { mentorId?: string; creator?: string }
  ) {
    if (!file) throw new BadRequestException('PDF file is required');
    return this.commandBus.execute(
      new CreateBookSourceCommand(
        file.buffer,
        file.originalname,
        body.mentorId,
        body.creator
      ),
    );
  }
}
