import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFavouriteIdeaCommand } from './deleteFavouriteIdea.command';
import { PrismaService } from 'src/database';

@CommandHandler(DeleteFavouriteIdeaCommand)
export class DeleteFavouriteIdeaHandler
  implements ICommandHandler<DeleteFavouriteIdeaCommand>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: DeleteFavouriteIdeaCommand) {
    return this.dbContext.favouriteIdea.delete({ where: { id: command.id } });
  }
}
