import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import _ from 'lodash';
import { PrismaService } from 'src/database';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly dbContext: PrismaService) {}

  public async comparePassword(option: {
    inputPassword: string;
    existedPassword: string;
  }): Promise<boolean> {
    const { inputPassword, existedPassword } = option;

    const isEqual = await bcrypt.compare(inputPassword, existedPassword);

    return isEqual;
  }

  public async verifyUser(option: { email: string; password: string }) {
    const { email, password } = option;

    const user = await this.dbContext.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        zodiacSign: true,
        displayName: true,
        avatarUrl: true,
        mbti: true,
        loveLanguages: true,
        createdAt: true,
        password: true,
        isEmailVerified: true,
      },
    });

    if (!user?.id) {
      throw new NotFoundException(
        'There is no user with that email in the system!',
      );
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException(
        'Your email is not verified. Please verify your email to login!',
      );
    }

    if (!user.password) {
      throw new BadRequestException(
        'Please login via your original authentication method.',
      );
    }

    const isRightPassword = await this.comparePassword({
      existedPassword: user.password,
      inputPassword: password,
    });

    return isRightPassword ? user : false;
  }

  public async getUserById(id: string): Promise<LoginUserDto> {
    const user = await this.dbContext.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  public async verifyUserTokenByDeviceId(userId: string, deviceId: string) {
    const token = await this.dbContext.token.findUnique({
      where: {
        deviceId_userId: {
          deviceId,
          userId,
        },
      },
    });

    if (!token?.id) {
      throw new NotFoundException(
        'There is no token with that device ID in the system!',
      );
    }
  }
}
