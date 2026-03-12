import { Request } from 'express';
import { CreateUserRequestBody } from './createUser.request-body';

export class CreateUserCommand {
  constructor(
    public readonly body: CreateUserRequestBody,
    public readonly req?: Request,
  ) {}
}
