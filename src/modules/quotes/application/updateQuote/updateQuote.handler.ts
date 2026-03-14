import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateQuoteCommand } from './updateQuote.command';
import { PrismaService } from 'src/database';

@CommandHandler(UpdateQuoteCommand)
export class UpdateQuoteHandler implements ICommandHandler<UpdateQuoteCommand> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute(command: UpdateQuoteCommand) {
    return this.dbContext.quote.update({
      where: { id: command.id },
      data: {
        ...(command.quote !== undefined && { quote: command.quote }),
        ...(command.photoUrl !== undefined && { photoUrl: command.photoUrl }),
      },
    });
  }
}
