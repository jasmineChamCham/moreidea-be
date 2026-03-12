import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiModel } from 'src/common/enum';
import { z } from 'zod';

export interface ExtractedIdea {
  idea_text: string;
  core: string | null;
  importance: string | null;
}

export interface ExtractionResult {
  title: string;
  creator: string | null;
  ideas: ExtractedIdea[];
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY not found');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async extractIdeasFromText(
    text: string,
    sourceType: 'book' | 'video',
    hintTitle?: string,
  ): Promise<ExtractionResult> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert knowledge extractor. Extract key ideas from the following ${sourceType === 'book' ? 'book text' : 'video transcript / description'}.

${hintTitle ? `Source title hint: "${hintTitle}"` : ''}

Text content:
---
${text.substring(0, 30000)}
---

Return ONLY valid JSON with this exact structure:
{
  "title": "Inferred or confirmed title of the source",
  "creator": "Author or creator name (null if unknown)",
  "ideas": [
    {
      "idea_text": "A clear, concise key idea from the source",
      "core": "The core theme or concept this idea belongs to (e.g. Habits, Mindset, Leadership)",
      "importance": "Why this idea matters (high/medium/low or a short sentence)"
    }
  ]
}

Extract between 5 and 20 of the most valuable ideas. Be specific and insightful.`;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in Gemini response');
      return JSON.parse(jsonMatch[0]) as ExtractionResult;
    } catch (e) {
      this.logger.error(`Gemini extraction failed: ${e.message}`);
      throw e;
    }
  }

  async generateMentorData(name: string): Promise<any> {
    const model = this.genAI.getGenerativeModel({
      model: GeminiModel.GEMINI_3_PRO_PREVIEW,
    });
    const prompt = `You are an expert researching historical, famous, or notable mentors/figures.
Generate detailed background data for the mentor named "${name}". 

Return ONLY valid JSON with this exact structure:
{
  "philosophy": "A short summary of their core philosophy",
  "mindset": "Their general mindset or approach to life/work",
  "style": "Their style of teaching, leading, or creating",
  "speakingStyle": "How they speak or spoke (e.g. direct, poetic, articulate)",
  "bodyLanguage": "Their typical body language",
  "bio": "A concise biography (1-2 paragraphs)",
  "era": "The era they lived in (e.g. Ancient Rome, 20th Century, Modern)",
  "archetype": "Their character archetype (e.g. The Sage, The Rebel, The Creator)"
}

Ensure the response is ONLY a JSON object and nothing else. If you are unsure, make an educated guess based on their public persona or historical record. If the person is completely unknown, return neutral generic plausible data.`;

    const mentorDataSchema = z.object({
      philosophy: z.string(),
      mindset: z.string(),
      style: z.string(),
      speakingStyle: z.string(),
      bodyLanguage: z.string(),
      bio: z.string(),
      era: z.string(),
      archetype: z.string(),
    });

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in Gemini response');

      const parsedJson = JSON.parse(jsonMatch[0]);
      return mentorDataSchema.parse(parsedJson);
    } catch (e) {
      this.logger.error(
        `Gemini generate mentor data failed: ${e instanceof Error ? e.message : String(e)}`,
      );
      throw e;
    }
  }
}
