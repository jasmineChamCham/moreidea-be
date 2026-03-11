import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateFavouriteIdeaCommand,
  CreateFavouriteIdeaDto,
} from './createFavouriteIdea.command';

@ApiTags('Favourite Ideas')
@Controller({ path: 'favourite-ideas', version: '1' })
export class CreateFavouriteIdeaEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Create a new favourite idea' })
  @Post()
  public create(@Body() dto: CreateFavouriteIdeaDto) {
    return this.commandBus.execute(new CreateFavouriteIdeaCommand(dto));
  }
}
