import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMentorsQuery } from './getMentors.query';

@ApiTags('Mentors')
@Controller({ path: 'mentors', version: '1' })
export class GetMentorsEndpoint {
  constructor(protected queryBus: QueryBus) {}

  @ApiOperation({ description: 'Get all mentors' })
  @Get()
  public get() {
    return this.queryBus.execute(new GetMentorsQuery());
  }
}
