import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateMentorDataCommand } from './generateMentorData.command';
import { GeminiService } from 'src/modules/gemini/gemini.service';

@CommandHandler(GenerateMentorDataCommand)
export class GenerateMentorDataHandler implements ICommandHandler<GenerateMentorDataCommand> {
  constructor(private readonly geminiService: GeminiService) {}

  public async execute(command: GenerateMentorDataCommand) {
    const { dto } = command;
    return this.geminiService.generateMentorData(dto.name);
  }
}
