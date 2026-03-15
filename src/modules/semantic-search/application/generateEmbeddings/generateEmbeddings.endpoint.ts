import { Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateEmbeddingsCommand } from './generateEmbeddings.command';

@ApiTags('semantic-search')
@Controller({ path: 'semantic-search', version: '1' })
export class GenerateEmbeddingsEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @Post('generate-embeddings')
  @ApiOperation({ summary: 'Generate embeddings for existing data' })
  @ApiResponse({ status: 200, description: 'Embeddings generated successfully' })
  public generateEmbeddings() {
    return this.commandBus.execute(new GenerateEmbeddingsCommand());
  }
}
