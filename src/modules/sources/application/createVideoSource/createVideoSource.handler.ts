import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVideoSourceCommand } from './createVideoSource.command';
import { PrismaService } from 'src/database';
import { GeminiService } from 'src/modules/gemini/gemini.service';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateVideoSourceCommand)
export class CreateVideoSourceHandler implements ICommandHandler<CreateVideoSourceCommand> {
  private readonly logger = new Logger(CreateVideoSourceHandler.name);

  constructor(
    private readonly dbContext: PrismaService,
    private readonly geminiService: GeminiService,
  ) { }

  public async execute(command: CreateVideoSourceCommand) {
    const { dto } = command;

    this.logger.log(`Extracting ideas from video: ${dto.title}`);

    // If subtitles are provided, use them directly for idea extraction
    let extracted;
    if (dto.subtitles && dto.subtitles.trim()) {
      extracted = await this.geminiService.extractIdeasFromText(
        dto.subtitles,
        dto.title
      );
    } else if (dto.url) {
      // Fallback to URL-based extraction if no subtitles provided
      extracted = await this.geminiService.extractIdeasFromVideo(
        dto.url,
        dto.title,
      );
    } else {
      // If no URL and no subtitles, just create the source without ideas
      extracted = { title: dto.title, ideas: [], creator: null };
    }

    const source = await this.dbContext.bookVideoSource.create({
      data: {
        sourceTitle: extracted.title || dto.title,
        sourceType: 'video',
        creator: extracted.creator || null,
        sourceUrl: dto.url || null,
      },
    });

    if (extracted.ideas?.length > 0) {
      await this.dbContext.sourceIdea.createMany({
        data: extracted.ideas.map((idea) => ({
          sourceId: source.id,
          ideaText: idea.idea_text,
          core: idea.core || null,
          importance: idea.importance || null,
          application: idea.application || null,
          example: idea.example || null,
        })),
      });
    }

    return {
      ...source,
      ideas: extracted.ideas,
      ideasExtracted: extracted.ideas?.length ?? 0,
    };
  }
}
