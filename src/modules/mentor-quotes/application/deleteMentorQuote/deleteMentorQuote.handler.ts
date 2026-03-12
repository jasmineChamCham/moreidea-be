import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMentorQuoteCommand } from './deleteMentorQuote.command';
import { PrismaService } from 'src/database';

@CommandHandler(DeleteMentorQuoteCommand)
export class DeleteMentorQuoteHandler implements ICommandHandler<DeleteMentorQuoteCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: DeleteMentorQuoteCommand) {
    const { id } = command;
    return this.dbContext.mentorQuote.delete({
      where: { id },
    });
  }
}
