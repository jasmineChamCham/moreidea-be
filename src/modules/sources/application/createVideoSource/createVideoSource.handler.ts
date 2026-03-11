import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVideoSourceCommand } from './createVideoSource.command';
import { PrismaService } from 'src/database';
import { GeminiService } from 'src/modules/gemini/gemini.service';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateVideoSourceCommand)
export class CreateVideoSourceHandler
  implements ICommandHandler<CreateVideoSourceCommand>
{
  private readonly logger = new Logger(CreateVideoSourceHandler.name);

  constructor(
    private readonly dbContext: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  public async execute(command: CreateVideoSourceCommand) {
    const { dto } = command;
    const textContent = `Video source URL: ${dto.sourceUrl}\nTitle hint: ${dto.sourceTitle || 'Unknown'}`;

    this.logger.log(`Extracting ideas from video URL: ${dto.sourceUrl}`);
    const extracted = await this.geminiService.extractIdeasFromText(
      textContent,
      'video',
      dto.sourceTitle,
    );

    const source = await this.dbContext.bookVideoSource.create({
      data: {
        sourceTitle: extracted.title || dto.sourceTitle || 'Untitled Video',
        sourceType: 'video',
        creator: extracted.creator || null,
        sourceUrl: dto.sourceUrl,
      },
    });

    if (extracted.ideas?.length > 0) {
      await this.dbContext.sourceIdea.createMany({
        data: extracted.ideas.map((idea) => ({
          sourceId: source.id,
          ideaText: idea.idea_text,
          core: idea.core || null,
          importance: idea.importance || null,
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
