import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookSourceCommand } from './createBookSource.command';
import { PrismaService } from 'src/database';
import { GeminiService } from 'src/modules/gemini/gemini.service';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateEmbeddingCommand } from 'src/modules/embeddings/application/generateEmbedding/generateEmbedding.command';
import { UpsertEmbeddingCommand } from 'src/modules/qdrant/application/upsertEmbedding/upsertEmbedding.command';
import { Logger } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import { generateTextForSourceIdea } from 'src/common/utils/string';
import { SearchContentType } from 'src/common/enum';

@CommandHandler(CreateBookSourceCommand)
export class CreateBookSourceHandler implements ICommandHandler<CreateBookSourceCommand> {
  private readonly logger = new Logger(CreateBookSourceHandler.name);

  constructor(
    private readonly dbContext: PrismaService,
    private readonly geminiService: GeminiService,
    private readonly commandBus: CommandBus,
  ) { }

  public async execute(command: CreateBookSourceCommand) {
    const { fileBuffer, originalFileName, mentorId, creator } = command;

    this.logger.log(`Parsing PDF: ${originalFileName}`);
    let pdfText = '';
    try {
      const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });

      const result = await parser.getText();
      const { pages, total, text } = result;
      pdfText = result.pages.map((page) => page.text).join('\n');
    } catch (e) {
      this.logger.warn(`PDF parse failed, using filename only: ${e.message}`);
      pdfText = `Book file: ${originalFileName}`;
    }

    this.logger.log(`Extracting ideas from book: ${originalFileName}`);
    const hintTitle = originalFileName.replace(/\.pdf$/i, '');
    const extracted = await this.geminiService.extractIdeasFromText(
      pdfText,
      hintTitle,
    );

    const source = await this.dbContext.bookVideoSource.create({
      data: {
        sourceTitle: extracted.title || hintTitle,
        sourceType: 'book',
        creator: extracted.creator || creator || null,
        filePath: `pdfs/${Date.now()}_${originalFileName}`,
        mentorId: mentorId || null,
      },
    });

    if (extracted.ideas?.length > 0) {
      // Create ideas one by one to get IDs immediately for embedding generation
      for (const idea of extracted.ideas) {
        try {
          // Create the idea first
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

          // Generate embedding using CommandBus
          const text = generateTextForSourceIdea(idea.idea_text, idea.core);
          const embedding = await this.commandBus.execute(
            new GenerateEmbeddingCommand(text)
          );

          // Store in Qdrant using CommandBus
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
      ideasExtracted: extracted.ideas?.length ?? 0,
    };
  }
}
