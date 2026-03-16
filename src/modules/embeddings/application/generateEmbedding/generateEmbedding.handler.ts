import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateEmbeddingCommand } from './generateEmbedding.command';
import { EmbeddingsService } from '../../embeddings.service';

@CommandHandler(GenerateEmbeddingCommand)
export class GenerateEmbeddingHandler implements ICommandHandler<GenerateEmbeddingCommand> {
  constructor(
    private readonly embeddingsService: EmbeddingsService,
  ) {}

  public async execute(command: GenerateEmbeddingCommand): Promise<number[]> {
    return this.embeddingsService.generateEmbedding(command.text);
  }
}
