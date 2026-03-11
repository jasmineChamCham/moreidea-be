import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBookSourceCommand } from './createBookSource.command';

@ApiTags('Sources')
@Controller({ path: 'sources', version: '1' })
export class CreateBookSourceEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Upload a PDF book, extract ideas via Gemini' })
  @ApiConsumes('multipart/form-data')
  @Post('book')
  @UseInterceptors(FileInterceptor('file'))
  public create(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('PDF file is required');
    return this.commandBus.execute(
      new CreateBookSourceCommand(file.buffer, file.originalname),
    );
  }
}
