import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetFavouritesQuery } from './getFavourites.query';

@ApiTags('Favourite Ideas')
@Controller({ path: 'favourite-ideas', version: '1' })
export class GetFavouritesEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all favourite ideas' })
  @Get()
  public get() {
    return this.queryBus.execute(new GetFavouritesQuery());
  }
}
