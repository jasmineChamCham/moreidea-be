import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMentorCommand, CreateMentorDto } from './createMentor.command';

@ApiTags('Mentors')
@Controller({ path: 'mentors', version: '1' })
export class CreateMentorEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create a new mentor' })
  @Post()
  public create(@Body() dto: CreateMentorDto) {
    return this.commandBus.execute(new CreateMentorCommand(dto));
  }
}
