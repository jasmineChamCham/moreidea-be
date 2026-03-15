import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookSourceCommand } from './createBookSource.command';
import { PrismaService } from 'src/database';
import { GeminiService } from 'src/modules/gemini/gemini.service';
import { Logger } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

@CommandHandler(CreateBookSourceCommand)
export class CreateBookSourceHandler implements ICommandHandler<CreateBookSourceCommand> {
  private readonly logger = new Logger(CreateBookSourceHandler.name);

  constructor(
    private readonly dbContext: PrismaService,
    private readonly geminiService: GeminiService,
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
      ideasExtracted: extracted.ideas?.length ?? 0,
    };
  }
}
