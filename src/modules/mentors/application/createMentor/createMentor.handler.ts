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
        avatarUrl: dto.avatarUrl ?? null,
        philosophy: dto.philosophy ?? null,
        mindset: dto.mindset ?? null,
        style: dto.style ?? null,
        speakingStyle: dto.speakingStyle ?? null,
        bodyLanguage: dto.bodyLanguage ?? null,
        bio: dto.bio ?? null,
        era: dto.era ?? null,
        archetype: dto.archetype ?? null,
      },
    });
  }
}
