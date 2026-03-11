import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateVideoSourceCommand,
  CreateVideoSourceDto,
} from './createVideoSource.command';

@ApiTags('Sources')
@Controller({ path: 'sources', version: '1' })
export class CreateVideoSourceEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create a source from a video URL and extract ideas via Gemini' })
  @Post('video')
  public create(@Body() dto: CreateVideoSourceDto) {
    return this.commandBus.execute(new CreateVideoSourceCommand(dto));
  }
}
