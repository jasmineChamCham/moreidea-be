import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTopicCommand } from './deleteTopic.command';
import { PrismaService } from 'src/database';

@CommandHandler(DeleteTopicCommand)
export class DeleteTopicHandler implements ICommandHandler<DeleteTopicCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: DeleteTopicCommand) {
    const { id } = command;
    return this.dbContext.topic.delete({
      where: { id },
    });
  }
}
