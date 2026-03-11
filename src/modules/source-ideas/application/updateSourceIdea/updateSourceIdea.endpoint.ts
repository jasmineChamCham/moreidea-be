import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  UpdateSourceIdeaCommand,
  UpdateSourceIdeaDto,
} from './updateSourceIdea.command';

@ApiTags('Source Ideas')
@Controller({ path: 'ideas', version: '1' })
export class UpdateSourceIdeaEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update an idea' })
  @Patch(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateSourceIdeaDto) {
    return this.commandBus.execute(new UpdateSourceIdeaCommand(id, dto));
  }
}
