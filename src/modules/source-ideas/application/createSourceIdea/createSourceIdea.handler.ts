import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSourceIdeaCommand } from './createSourceIdea.command';
import { PrismaService } from 'src/database';

@CommandHandler(CreateSourceIdeaCommand)
export class CreateSourceIdeaHandler
  implements ICommandHandler<CreateSourceIdeaCommand>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: CreateSourceIdeaCommand) {
    const { sourceId, dto } = command;
    return this.dbContext.sourceIdea.create({
      data: {
        sourceId,
        ideaText: dto.ideaText,
        core: dto.core ?? null,
        importance: dto.importance ?? null,
      },
    });
  }
}
