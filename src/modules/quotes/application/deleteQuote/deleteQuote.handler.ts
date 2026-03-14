import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteQuoteCommand } from './deleteQuote.command';
import { PrismaService } from 'src/database';

@CommandHandler(DeleteQuoteCommand)
export class DeleteQuoteHandler implements ICommandHandler<DeleteQuoteCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: DeleteQuoteCommand) {
    return this.dbContext.quote.delete({
      where: { id: command.id },
    });
  }
}
