import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMentorCommand } from './updateMentor.command';
import { PrismaService } from 'src/database';

@CommandHandler(UpdateMentorCommand)
export class UpdateMentorHandler implements ICommandHandler<UpdateMentorCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: UpdateMentorCommand) {
    const { id, dto } = command;
    return this.dbContext.mentor.update({
      where: { id },
      data: dto,
    });
  }
}
