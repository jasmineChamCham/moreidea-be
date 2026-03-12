import { LoginUserDto } from 'src/common/dto/loginUser.dto';
import { UpdateUserByIdRequestBody } from './updateUserById.request-body';

export class UpdateUserByIdCommand {
  constructor(
    public readonly id: string,
    public readonly body: UpdateUserByIdRequestBody,
    public readonly currentUser: LoginUserDto,
  ) {}
}
