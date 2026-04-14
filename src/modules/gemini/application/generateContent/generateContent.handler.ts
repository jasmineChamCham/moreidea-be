import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateContentCommand } from './generateContent.command';
import { GeminiService } from '../../gemini.service';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/database';

@CommandHandler(GenerateContentCommand)
export class GenerateContentHandler implements ICommandHandler<GenerateContentCommand> {
  private readonly logger = new Logger(GenerateContentHandler.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly dbContext: PrismaService,
  ) { }

  public async execute(command: GenerateContentCommand) {
    const { dto } = command;
    this.logger.log(`Generating content for topic: ${dto.topic}`);

    const generatedContent = await this.geminiService.generateContent(
      dto.topic,
      dto.platform,
      dto.ideas
    );

    // Save to database
    const savedContent = await this.dbContext.content.create({
      data: {
        title: generatedContent?.title,
        platform: generatedContent?.platform,
        content: generatedContent?.content,
        analysis: generatedContent?.analysis,
        bodyLanguage: generatedContent?.bodyLanguage,
        toneVoice: generatedContent?.toneVoice,
        score: generatedContent?.score,
        topic: dto.topic,
      },
    });

    this.logger.log(`Content saved to database with ID: ${savedContent.id}`);
    return savedContent;
  }
}
