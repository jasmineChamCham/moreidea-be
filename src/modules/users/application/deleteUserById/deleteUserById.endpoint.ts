import { Controller, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteUserByIdCommand } from './deleteUserById.command';
import { DeleteUserByIdRequestParam } from './deleteUserById.request-param';
import { RoleGuard } from 'src/common/role/role.guard';
import { Role } from 'src/common/role/role.decorator';
import { RoleType } from '@prisma/client';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { LogAction, LogEntityType } from 'src/common/enum';

@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN, RoleType.SUPERADMIN)
export class DeleteUserByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: 'Delete user by id' })
  @Delete(':id')
  public async delete(
    @Param() { id }: DeleteUserByIdRequestParam,
    @RequestUser() currentUser: LoginUserDto,
    @Req() req: Request,
  ): Promise<void> {
    await this.commandBus.execute<DeleteUserByIdCommand, void>(
      new DeleteUserByIdCommand(id),
    );

    return;
  }
}
