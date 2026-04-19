import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAnchorsQuery } from './getAnchors.query';
import { GetAnchorsQueryResponse } from './getAnchors.query';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Anchors')
@Controller({ path: 'anchors', version: '1' })
export class GetAnchorsEndpoint {
  constructor(private readonly queryBus: QueryBus) { }

  @Get()
  async execute(): Promise<GetAnchorsQueryResponse> {
    return await this.queryBus.execute(new GetAnchorsQuery());
  }
}
