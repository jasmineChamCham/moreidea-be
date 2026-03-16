import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateQuoteCommand } from './createQuote.command';
import { PrismaService } from 'src/database';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateEmbeddingCommand } from 'src/modules/embeddings/application/generateEmbedding/generateEmbedding.command';
import { UpsertEmbeddingCommand } from 'src/modules/qdrant/application/upsertEmbedding/upsertEmbedding.command';
import { Logger } from '@nestjs/common';
import { SearchContentType } from 'src/common/enum';

@CommandHandler(CreateQuoteCommand)
export class CreateQuoteHandler implements ICommandHandler<CreateQuoteCommand> {
  private readonly logger = new Logger(CreateQuoteHandler.name);

  constructor(
    private readonly dbContext: PrismaService,
    private readonly commandBus: CommandBus,
  ) { }

  public async execute(command: CreateQuoteCommand) {
    const quote = await this.dbContext.quote.create({
      data: {
        mentorId: command.mentorId,
        quote: command.quote,
        photoUrl: command.photoUrl,
      },
    });

    // Generate embedding and store in Qdrant
    try {
      // Generate embedding using CommandBus
      const embedding = await this.commandBus.execute(
        new GenerateEmbeddingCommand(command.quote)
      );

      const mentor = await this.dbContext.mentor.findUnique({
        where: {
          id: command.mentorId,
        },
      });

      // Store in Qdrant using CommandBus
      await this.commandBus.execute(
        new UpsertEmbeddingCommand(
          quote.id,
          embedding,
          {
            text: command.quote,
            photoUrl: command.photoUrl || '',
            mentorId: command.mentorId,
            mentorName: mentor?.name || '',
            createdAt: quote.createdAt.toISOString(),
          },
          SearchContentType.QUOTE
        )
      );

      this.logger.log(`Created embedding for quote: ${quote.id}`);
    } catch (error) {
      this.logger.error(`Error creating embedding for quote ${quote.id}:`, error);
    }

    return quote;
  }
}
