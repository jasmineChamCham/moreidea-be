import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenerateContentCommand, GenerateContentDto } from './generateContent.command';

@ApiTags('Gemini')
@Controller({ path: 'gemini', version: '1' })
export class GenerateContentEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Generate content using Gemini' })
  @Post('generate-content')
  public generateContent(@Body() dto: GenerateContentDto) {
    return this.commandBus.execute(new GenerateContentCommand(dto));
  }
}
