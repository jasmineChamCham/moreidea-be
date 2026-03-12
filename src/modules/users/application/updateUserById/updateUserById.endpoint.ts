import { Body, Controller, Param, Put, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserByIdCommand } from './updateUserById.command';
import { UpdateUserByIdRequestBody } from './updateUserById.request-body';
import { UpdateUserByIdRequestParam } from './updateUserById.request-param';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { LogAction } from 'src/common/enum';

@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard)
export class UpdateUserByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Update user by id' })
  @Put(':id')
  public async update(
    @Param() { id }: UpdateUserByIdRequestParam,
    @Body() body: UpdateUserByIdRequestBody,
    @RequestUser() currentUser: LoginUserDto,
    @Req() req: Request,
  ): Promise<LoginUserDto> {
    const result = await this.commandBus.execute<
      UpdateUserByIdCommand,
      LoginUserDto
    >(new UpdateUserByIdCommand(id, body, currentUser));

    return result;
  }
}
