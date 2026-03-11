import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMentorCommand } from './deleteMentor.command';
import { PrismaService } from 'src/database';

@CommandHandler(DeleteMentorCommand)
export class DeleteMentorHandler implements ICommandHandler<DeleteMentorCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: DeleteMentorCommand) {
    return this.dbContext.mentor.delete({ where: { id: command.id } });
  }
}
