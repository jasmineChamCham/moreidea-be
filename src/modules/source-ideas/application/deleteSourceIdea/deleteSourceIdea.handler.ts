import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSourceIdeaCommand } from './deleteSourceIdea.command';
import { PrismaService } from 'src/database';

@CommandHandler(DeleteSourceIdeaCommand)
export class DeleteSourceIdeaHandler
  implements ICommandHandler<DeleteSourceIdeaCommand>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: DeleteSourceIdeaCommand) {
    return this.dbContext.sourceIdea.delete({ where: { id: command.id } });
  }
}
