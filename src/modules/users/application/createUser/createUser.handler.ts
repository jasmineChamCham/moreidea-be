import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './createUser.command';
import { CreateUserRequestBody } from './createUser.request-body';
import { PrismaService } from 'src/database';
import { hashString } from 'src/common/utils/string';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { LogAction, LogEntityType } from 'src/common/enum';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: CreateUserCommand): Promise<LoginUserDto> {
    const {
      body: { email },
      req,
    } = command;

    await this.validate({ email });

    const user = await this.createUser(command.body);

    return user;
  }

  private async createUser(body: CreateUserRequestBody): Promise<LoginUserDto> {
    const {
      displayName,
      avatarUrl,
      role,
      email,
      password,
      mbti,
      zodiacSign,
      loveLanguages,
    } = body;

    const hashedPassword = hashString(password);

    const user = await this.dbContext.user.create({
      data: {
        displayName,
        email,
        role,
        avatarUrl,
        mbti,
        zodiacSign,
        loveLanguages,
        password: hashedPassword,
      },
      select: {
        id: true,
        avatarUrl: true,
        displayName: true,
        email: true,
        role: true,
        mbti: true,
        zodiacSign: true,
        loveLanguages: true,
        createdAt: true,
      },
    });

    return user;
  }

  private async validate(option: { email: string }) {
    const { email } = option;

    const existedUser = await this.dbContext.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existedUser?.id) {
      throw new BadRequestException('This user is already in system');
    }
  }
}
