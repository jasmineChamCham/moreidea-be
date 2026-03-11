import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSourceIdeaCommand } from './updateSourceIdea.command';
import { PrismaService } from 'src/database';

@CommandHandler(UpdateSourceIdeaCommand)
export class UpdateSourceIdeaHandler
  implements ICommandHandler<UpdateSourceIdeaCommand>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: UpdateSourceIdeaCommand) {
    const { id, dto } = command;
    return this.dbContext.sourceIdea.update({
      where: { id },
      data: dto,
    });
  }
}
