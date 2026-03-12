import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMentorQuoteCommand } from './createMentorQuote.command';
import { PrismaService } from 'src/database';

@CommandHandler(CreateMentorQuoteCommand)
export class CreateMentorQuoteHandler implements ICommandHandler<CreateMentorQuoteCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: CreateMentorQuoteCommand) {
    const { mentorId, dto } = command;
    return this.dbContext.mentorQuote.create({
      data: {
        mentorId,
        quote: dto.quote,
        meaning: dto.meaning ?? null,
      },
    });
  }
}
