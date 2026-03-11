import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookSourceCommand } from './createBookSource.command';
import { PrismaService } from 'src/database';
import { GeminiService } from 'src/modules/gemini/gemini.service';
import { Logger } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';

@CommandHandler(CreateBookSourceCommand)
export class CreateBookSourceHandler
  implements ICommandHandler<CreateBookSourceCommand>
{
  private readonly logger = new Logger(CreateBookSourceHandler.name);

  constructor(
    private readonly dbContext: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  public async execute(command: CreateBookSourceCommand) {
    const { fileBuffer, originalFileName } = command;

    this.logger.log(`Parsing PDF: ${originalFileName}`);
    let pdfText = '';
    try {
      const parsed = await pdfParse(fileBuffer);
      pdfText = parsed.text;
    } catch (e) {
      this.logger.warn(`PDF parse failed, using filename only: ${e.message}`);
      pdfText = `Book file: ${originalFileName}`;
    }

    this.logger.log(`Extracting ideas from book: ${originalFileName}`);
    const hintTitle = originalFileName.replace(/\.pdf$/i, '');
    const extracted = await this.geminiService.extractIdeasFromText(
      pdfText,
      'book',
      hintTitle,
    );

    const source = await this.dbContext.bookVideoSource.create({
      data: {
        sourceTitle: extracted.title || hintTitle,
        sourceType: 'book',
        creator: extracted.creator || null,
        filePath: `pdfs/${Date.now()}_${originalFileName}`,
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
      ideasExtracted: extracted.ideas?.length ?? 0,
    };
  }
}
