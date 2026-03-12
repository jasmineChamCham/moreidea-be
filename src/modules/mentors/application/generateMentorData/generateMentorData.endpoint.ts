import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenerateMentorDataCommand, GenerateMentorDataDto } from './generateMentorData.command';

@ApiTags('Mentors')
@Controller({ path: 'mentors', version: '1' })
export class GenerateMentorDataEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Generate mentor data using AI' })
  @Post('generate')
  public generate(@Body() dto: GenerateMentorDataDto) {
    return this.commandBus.execute(new GenerateMentorDataCommand(dto));
  }
}
