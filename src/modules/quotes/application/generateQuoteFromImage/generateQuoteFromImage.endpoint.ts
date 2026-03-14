import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenerateQuoteFromImageDto } from './generateQuoteFromImage.dto';
import { GenerateQuoteFromImageCommand } from './generateQuoteFromImage.command';

@ApiTags('Quotes')
@Controller({ path: 'quotes', version: '1' })
export class GenerateQuoteFromImageEndpoint {
  constructor(protected commandBus: CommandBus) { }

  @ApiOperation({ description: 'Generate a quote from an image URL using Gemini AI' })
  @Post('generate-from-image')
  public generateFromImage(@Body() body: GenerateQuoteFromImageDto) {
    return this.commandBus.execute(
      new GenerateQuoteFromImageCommand(body.imageUrl),
    );
  }
}
