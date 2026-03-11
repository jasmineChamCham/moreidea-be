import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateSourceIdeaCommand,
  CreateSourceIdeaDto,
} from './createSourceIdea.command';

@ApiTags('Source Ideas')
@Controller({ path: 'sources/:sourceId/ideas', version: '1' })
export class CreateSourceIdeaEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create a new idea for a source manually' })
  @Post()
  public create(
    @Param('sourceId') sourceId: string,
    @Body() dto: CreateSourceIdeaDto,
  ) {
    return this.commandBus.execute(new CreateSourceIdeaCommand(sourceId, dto));
  }
}
