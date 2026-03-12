import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMentorQuoteCommand } from './updateMentorQuote.command';
import { PrismaService } from 'src/database';

@CommandHandler(UpdateMentorQuoteCommand)
export class UpdateMentorQuoteHandler implements ICommandHandler<UpdateMentorQuoteCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: UpdateMentorQuoteCommand) {
    const { id, dto } = command;
    return this.dbContext.mentorQuote.update({
      where: { id },
      data: dto,
    });
  }
}
