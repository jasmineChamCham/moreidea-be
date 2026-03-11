import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateMentorCommand, UpdateMentorDto } from './updateMentor.command';

@ApiTags('Mentors')
@Controller({ path: 'mentors', version: '1' })
export class UpdateMentorEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update a mentor' })
  @Patch(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateMentorDto) {
    return this.commandBus.execute(new UpdateMentorCommand(id, dto));
  }
}
