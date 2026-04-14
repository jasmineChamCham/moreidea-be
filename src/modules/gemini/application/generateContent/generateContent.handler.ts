import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateContentCommand } from './generateContent.command';
import { GeminiService } from '../../gemini.service';
import { Logger } from '@nestjs/common';

@CommandHandler(GenerateContentCommand)
export class GenerateContentHandler implements ICommandHandler<GenerateContentCommand> {
  private readonly logger = new Logger(GenerateContentHandler.name);

  constructor(private readonly geminiService: GeminiService) {}

  public async execute(command: GenerateContentCommand) {
    const { dto } = command;
    this.logger.log(`Generating content for topic: ${dto.topic}`);
    return this.geminiService.generateContent(
      dto.topic,
      dto.platform,
      dto.ideas
    );
  }
}
