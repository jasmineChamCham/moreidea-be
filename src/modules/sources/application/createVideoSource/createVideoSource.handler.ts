import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVideoSourceCommand } from './createVideoSource.command';
import { PrismaService } from 'src/database';
import { GeminiService } from 'src/modules/gemini/gemini.service';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateEmbeddingCommand } from 'src/modules/embeddings/application/generateEmbedding/generateEmbedding.command';
import { UpsertEmbeddingCommand } from 'src/modules/qdrant/application/upsertEmbedding/upsertEmbedding.command';
import { Logger } from '@nestjs/common';
import { generateTextForSourceIdea } from 'src/common/utils/string';
import { SearchContentType } from 'src/common/enum';

@CommandHandler(CreateVideoSourceCommand)
export class CreateVideoSourceHandler implements ICommandHandler<CreateVideoSourceCommand> {
  private readonly logger = new Logger(CreateVideoSourceHandler.name);

  constructor(
    private readonly dbContext: PrismaService,
    private readonly geminiService: GeminiService,
    private readonly commandBus: CommandBus,
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
        creator: extracted.creator || dto.creator || null,
        sourceUrl: dto.url || null,
        mentorId: dto.mentorId || null,
      },
    });

    if (extracted.ideas?.length > 0) {
      for (const idea of extracted.ideas) {
        try {
          const createdIdea = await this.dbContext.sourceIdea.create({
            data: {
              sourceId: source.id,
              ideaText: idea.idea_text,
              core: idea.core || null,
              importance: idea.importance || null,
              application: idea.application || null,
              example: idea.example || null,
            },
          });

          const mentor = await this.dbContext.mentor.findUnique({
            where: { id: dto.mentorId },
          });

          // Generate embedding
          const text = generateTextForSourceIdea(idea.idea_text, idea.core);
          const embedding = await this.commandBus.execute(
            new GenerateEmbeddingCommand(text)
          );

          // Store in Qdrant
          await this.commandBus.execute(
            new UpsertEmbeddingCommand(
              createdIdea.id,
              embedding,
              {
                text: idea.idea_text,
                sourceId: source.id,
                sourceTitle: source.sourceTitle,
                sourceType: source.sourceType,
                sourceUrl: source.sourceUrl,
                creator: source.creator,
                core: idea.core,
                importance: idea.importance,
                application: idea.application,
                example: idea.example,
                mentorId: source.mentorId,
                mentorName: mentor?.name || null,
                style: mentor?.style || null,
                speakingStyle: mentor?.speakingStyle || null,
                bodyLanguage: mentor?.bodyLanguage || null,
                createdAt: createdIdea.createdAt.toISOString(),
              },
              SearchContentType.SOURCE_IDEA
            )
          );
        } catch (error) {
          this.logger.error(`Error creating embedding for idea: ${idea.idea_text.substring(0, 50)}...`, error);
        }
      }
    }

    return {
      ...source,
      ideas: extracted.ideas,
      ideasExtracted: extracted.ideas?.length ?? 0,
    };
  }
}
