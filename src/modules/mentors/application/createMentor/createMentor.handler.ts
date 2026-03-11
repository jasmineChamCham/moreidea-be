import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMentorCommand } from './createMentor.command';
import { PrismaService } from 'src/database';

@CommandHandler(CreateMentorCommand)
export class CreateMentorHandler implements ICommandHandler<CreateMentorCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: CreateMentorCommand) {
    const { dto } = command;
    return this.dbContext.mentor.create({
      data: {
        name: dto.name,
        style: dto.style,
        bgVibe: dto.bgVibe ?? null,
        cameraAngle: dto.cameraAngle ?? null,
      },
    });
  }
}
