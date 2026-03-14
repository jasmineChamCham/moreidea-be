import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateQuoteCommand } from './createQuote.command';
import { PrismaService } from 'src/database';

@CommandHandler(CreateQuoteCommand)
export class CreateQuoteHandler implements ICommandHandler<CreateQuoteCommand> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute(command: CreateQuoteCommand) {
    return this.dbContext.quote.create({
      data: {
        mentorId: command.mentorId,
        quote: command.quote,
        photoUrl: command.photoUrl,
      },
    });
  }
}
