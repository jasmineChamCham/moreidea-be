import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTopicCommand } from './createTopic.command';
import { PrismaService } from 'src/database';

@CommandHandler(CreateTopicCommand)
export class CreateTopicHandler implements ICommandHandler<CreateTopicCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: CreateTopicCommand) {
    const { dto } = command;
    return this.dbContext.topic.create({
      data: dto,
    });
  }
}
