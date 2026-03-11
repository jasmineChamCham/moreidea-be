import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFavouriteIdeaCommand } from './createFavouriteIdea.command';
import { PrismaService } from 'src/database';

@CommandHandler(CreateFavouriteIdeaCommand)
export class CreateFavouriteIdeaHandler
  implements ICommandHandler<CreateFavouriteIdeaCommand>
{
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: CreateFavouriteIdeaCommand) {
    const { dto } = command;
    return this.dbContext.favouriteIdea.create({
      data: {
        person: dto.person,
        quote: dto.quote,
        place: dto.place ?? null,
        photoUrl: dto.photoUrl ?? null,
      },
    });
  }
}
