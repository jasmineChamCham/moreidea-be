import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteFavouriteIdeaCommand } from './deleteFavouriteIdea.command';

@ApiTags('Favourite Ideas')
@Controller({ path: 'favourite-ideas', version: '1' })
export class DeleteFavouriteIdeaEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete a favourite idea' })
  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteFavouriteIdeaCommand(id));
  }
}
