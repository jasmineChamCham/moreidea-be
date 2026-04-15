import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetContentsQuery } from './getContents.query';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller({ path: 'contents', version: '1' })
export class GetContentsEndpoint {
  constructor(private readonly queryBus: QueryBus) { }

  @Get()
  @ApiOperation({ summary: 'Get all generated contents' })
  @ApiResponse({ status: 200, description: 'Contents retrieved successfully' })
  async getContents() {
    return this.queryBus.execute(new GetContentsQuery());
  }
}
