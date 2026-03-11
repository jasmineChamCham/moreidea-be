import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/modules/users/services';

@Injectable()
export class AuthenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    const secret = this.configService.get<string>('ACCESS_TOKEN_SECRET');

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret });

      if (!payload?.dataToken) {
        throw new UnauthorizedException('You are not authenticated to do this');
      }

      const dataToken = payload.dataToken;

      if (!dataToken.deviceId) {
        throw new UnauthorizedException('You have to login again!');
      }

      const { deviceId, ...user } = dataToken;

      await Promise.all([
        this.userService.getUserById(user.id),
        this.userService.verifyUserTokenByDeviceId(user.id, deviceId),
      ]);

      request.user = user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Please provide the access-token');
    }

    return token;
  }
}
