import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSourceCommand } from './deleteSource.command';
import { PrismaService } from 'src/database';

@CommandHandler(DeleteSourceCommand)
export class DeleteSourceHandler implements ICommandHandler<DeleteSourceCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: DeleteSourceCommand) {
    return this.dbContext.bookVideoSource.delete({ where: { id: command.id } });
  }
}
