import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpsertEmbeddingCommand } from './upsertEmbedding.command';
import { QdrantService } from '../../qdrant.service';
import { SearchContentType } from 'src/common/enum';

@CommandHandler(UpsertEmbeddingCommand)
export class UpsertEmbeddingHandler implements ICommandHandler<UpsertEmbeddingCommand> {
  constructor(
    private readonly qdrantService: QdrantService,
  ) { }

  public async execute(command: UpsertEmbeddingCommand): Promise<void> {
    if (command.type === SearchContentType.QUOTE) {
      await this.qdrantService.upsertQuote(command.id, command.embedding, command.metadata);
    } else if (command.type === SearchContentType.SOURCE_IDEA) {
      await this.qdrantService.upsertSourceIdea(command.id, command.embedding, command.metadata);
    }
  }
}
