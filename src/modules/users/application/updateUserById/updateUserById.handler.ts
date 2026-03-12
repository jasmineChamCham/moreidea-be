import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserByIdCommand } from './updateUserById.command';
import { UpdateUserByIdRequestBody } from './updateUserById.request-body';
import { PrismaService } from 'src/database';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { RoleType } from '@prisma/client';

@CommandHandler(UpdateUserByIdCommand)
export class UpdateUserByIdHandler implements ICommandHandler<UpdateUserByIdCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: UpdateUserByIdCommand): Promise<LoginUserDto> {
    const existedUser = await this.validate({
      id: command.id,
      currentUser: command.currentUser,
    });

    return this.updateUserById(command.id, command.body);
  }

  private async updateUserById(
    id: string,
    body: UpdateUserByIdRequestBody,
  ): Promise<LoginUserDto> {
    const {
      avatarUrl,
      displayName,
      email,
      loveLanguages,
      mbti,
      zodiacSign,
      role,
      isAllowUserData,
    } = body;

    const user = await this.dbContext.user.update({
      where: { id },
      data: {
        avatarUrl,
        displayName,
        email,
        loveLanguages,
        mbti,
        zodiacSign,
        role,
        isAllowUserData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        role: true,
        mbti: true,
        zodiacSign: true,
        loveLanguages: true,
        isAllowUserData: true,
        createdAt: true,
      },
    });

    return user;
  }

  private async validate(options: { id: string; currentUser: LoginUserDto }) {
    const { id, currentUser } = options;
    const existedUser = await this.dbContext.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        avatarUrl: true,
      },
    });

    if (!existedUser?.id) {
      throw new NotFoundException('Not found any user with this id');
    }

    // Users can update themselves, or admins/superadmins can update anyone
    const isOwner = currentUser.id === id;
    const isAdmin =
      currentUser.role === RoleType.ADMIN ||
      currentUser.role === RoleType.SUPERADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You are not allowed to update this user');
    }

    return existedUser;
  }
}
