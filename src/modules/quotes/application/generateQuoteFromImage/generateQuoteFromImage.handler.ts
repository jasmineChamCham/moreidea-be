import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GeminiService } from '../../../gemini/gemini.service';
import { GenerateQuoteFromImageCommand } from './generateQuoteFromImage.command';

@CommandHandler(GenerateQuoteFromImageCommand)
export class GenerateQuoteFromImageHandler implements ICommandHandler<GenerateQuoteFromImageCommand> {
  constructor(private readonly geminiService: GeminiService) { }

  async execute(command: GenerateQuoteFromImageCommand): Promise<{ quote: string }> {
    const { imageUrl } = command;

    try {
      const quote = await this.geminiService.extractQuoteFromImage(imageUrl);
      return { quote };
    } catch (error) {
      throw new Error(`Failed to generate quote from image: ${error.message}`);
    }
  }
}
