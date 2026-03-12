import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTopicCommand } from './updateTopic.command';
import { PrismaService } from 'src/database';

@CommandHandler(UpdateTopicCommand)
export class UpdateTopicHandler implements ICommandHandler<UpdateTopicCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: UpdateTopicCommand) {
    const { id, dto } = command;
    return this.dbContext.topic.update({
      where: { id },
      data: dto,
    });
  }
}
