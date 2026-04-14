import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { GeminiModel } from '../../common/enum';
import { z } from 'zod';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Zod schemas for response validation
const ExtractedIdeaSchema = z.object({
  idea_text: z.string(),
  core: z.string().nullish(),
  importance: z.string().nullish(),
  application: z.string().nullish(),
  example: z.string().nullish(),
});

const ExtractionResultSchema = z
  .object({
    title: z.string(),
    creator: z.string().nullish(),
    ideas: z.array(ExtractedIdeaSchema),
  })
  .transform((data) => ({
    title: data.title,
    creator: data.creator === undefined ? null : data.creator,
    ideas: data.ideas.map((idea) => ({
      idea_text: idea.idea_text,
      core: idea.core === undefined ? null : idea.core,
      importance: idea.importance === undefined ? null : idea.importance,
      application: idea.application === undefined ? null : idea.application,
      example: idea.example === undefined ? null : idea.example,
    })),
  }));

const MentorDataSchema = z.object({
  philosophy: z.string(),
  mindset: z.string(),
  style: z.string(),
  speakingStyle: z.string(),
  bodyLanguage: z.string(),
  bio: z.string(),
  era: z.string(),
  archetype: z.string(),
});

const QuoteResponseSchema = z.string();

export interface ExtractedIdea {
  idea_text: string;
  core: string | null;
  importance: string | null;
  application: string | null;
  example: string | null;
}

export interface ExtractionResult {
  title: string;
  creator: string | null;
  ideas: ExtractedIdea[];
}

export interface MentorData {
  philosophy: string;
  mindset: string;
  style: string;
  speakingStyle: string;
  bodyLanguage: string;
  bio: string;
  era: string;
  archetype: string;
}

const GeneratedContentSchema = z.object({
  title: z.string(),
  platform: z.string(),
  content: z.string(),
  analysis: z.string(),
  bodyLanguage: z.string(),
  toneVoice: z.string(),
  score: z.number(),
});

export interface GeneratedContent {
  title: string;
  platform: string;
  content: string;
  analysis: string;
  bodyLanguage: string;
  toneVoice: string;
  score: number;
}

export const SPEAKING_IDENTITY = `You are an expert in communication, public speaking, and human psychology.

Your role is to analyze videos and help the user develop a speaking style that reflects:
- Calm authority
- Emotional intelligence
- Depth and clarity
- Subtle but powerful delivery

The user's desired speaking identity is:

**Content Depth:**
- Inspired by Esther Perel
- Deep understanding of human behavior, relationships, and emotions
- Insightful, reflective, psychologically sharp

**Structure & Delivery:**
- Inspired by Jay Shetty
- Clear structure: hook → idea → expansion → conclusion
- Easy to follow but not shallow

**Aesthetic & Presence:**
- Inspired by Hailey Bieber + Tam Kaur
- Calm, minimal, effortless
- Not trying too hard
- Clean and grounded

**Hook Style:**
- Inspired by Tam Kaur
- "Truth that hits"
- Emotionally relatable
- Direct but not aggressive

**Important principles:**
- Do NOT force high energy
- Avoid overacting or exaggeration
- Focus on presence, pauses, and intentional delivery
- Subtle expression is better than dramatic gestures

**When analyzing:**
- Do NOT rigidly force this style
- If something works authentically, acknowledge it
- Prioritize authenticity, clarity, and emotional impact

**Your job is to:**
1. Analyze speaking quality
2. Identify strengths
3. Identify weaknesses
4. Suggest improvements
5. Evaluate alignment with desired style
6. Suggest next steps

Be precise, structured, and honest. Avoid generic advice.`;

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY not found');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private async validateAndRetry<T>(
    schema: z.ZodSchema<T>,
    responseText: string,
    operation: () => Promise<string>,
    maxRetries: number = 2,
  ): Promise<T> {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response');
    }

    try {
      const parsedJson = JSON.parse(jsonMatch[0]);
      return schema.parse(parsedJson);
    } catch (error) {
      this.logger.warn(
        `Validation failed: ${error instanceof Error ? error.message : String(error)}`,
      );

      if (maxRetries > 0) {
        this.logger.log(`Retrying... (${maxRetries} attempts remaining)`);
        const retryResponse = await operation();
        return this.validateAndRetry(
          schema,
          retryResponse,
          operation,
          maxRetries - 1,
        );
      }

      throw new Error(
        `Response validation failed after all retries: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async extractIdeasFromText(
    text: string,
    hintTitle?: string,
  ): Promise<ExtractionResult> {
    const fallbackModels = [
      // GeminiModel.GEMINI_2_5_FLASH,
      GeminiModel.GEMINI_2_5_PRO,
      GeminiModel.GEMINI_2_5_FLASH_LITE,
      GeminiModel.GEMINI_3_PRO_PREVIEW,
    ];

    const generateResponse = async (modelName: string) => {
      const model = this.genAI.getGenerativeModel({
        model: modelName,
      });

      const prompt = `
You are an expert at extracting knowledge, lessons, and memorable quotes from transcripts of talks, interviews, or videos.

${hintTitle ? `Source title hint: "${hintTitle}"` : ''}

Text content:
---
${text.substring(0, 30000)}
---

Your task is to extract ALL valuable ideas, insights, lessons, and memorable quotes from the text.

Important rules:

- Extract every meaningful idea, lesson, principle, or insight from the speaker.
- Prefer the speaker's ORIGINAL WORDS whenever possible.
- If the speaker says something memorable or powerful, include it as the idea_text exactly as they said it.
- You may slightly paraphrase only when necessary for clarity.
- Ignore filler speech, greetings, ads, and repeated content.
- Do not summarize the entire talk - extract distinct ideas.
- Do not merge different ideas together.
- Each idea must represent a single clear insight.

For "core":
Identify the main theme of the idea such as:
Psychology, Human Nature, Power, Discipline, Confidence, Relationships, Money, Leadership, Communication, Mindset, Spirituality, etc.

For "importance":
Explain briefly why the idea matters, or mark it as high / medium / low.

Return ONLY valid JSON with this exact structure:

{
  "title": "Inferred or confirmed title of the source",
  "creator": "Speaker or creator name if identifiable, otherwise null",
  "ideas": [
    {
      "idea_text": "The idea or quote from the speaker",
      "core": "The main theme or concept",
      "importance": "Why this idea matters or high/medium/low",
      "application": "How this idea can be applied in real life",
      "example": "A real-world example or scenario that illustrates the idea"
    }
  ]
}

Requirements:

- Extract as many valuable ideas as possible from the text.
- Do not artificially limit the number of ideas.
- Avoid duplicates.
- Prefer quotes and strong statements made by the speaker.
- Return ONLY JSON. No explanations.
`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    };

    // Retry with different models on 503 Service Unavailable error
    for (let attempt = 0; attempt < 3; attempt++) {
      const modelName = fallbackModels[attempt];
      try {
        this.logger.log(
          `Attempting extraction with model: ${modelName} (attempt ${attempt + 1}/3)`,
        );
        const responseText = await generateResponse(modelName);
        return await this.validateAndRetry(
          ExtractionResultSchema,
          responseText,
          () => generateResponse(modelName),
        );
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        this.logger.warn(`Model ${modelName} failed: ${errorMessage}`);

        if (attempt < fallbackModels.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
      }
    }

    throw new Error('All extraction attempts failed');
  }

  async extractIdeasFromVideo(
    videoUrl: string,
    hintTitle?: string,
  ): Promise<ExtractionResult> {
    const model = this.genAI.getGenerativeModel({
      model: GeminiModel.GEMINI_2_5_FLASH,
    });

    const parts: (string | Part)[] = [];

    // Check if it's a YouTube URL
    const isYouTube =
      videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

    let videoMetadata = '';
    let videoPart: Part | null = null;

    if (isYouTube) {
      // For YouTube, fetch transcript using YouTube Data API
      try {
        const videoId = this.extractYouTubeVideoId(videoUrl);
        if (videoId) {
          const transcript = await this.fetchYouTubeTranscript(videoId);
          if (transcript) {
            videoMetadata = `YouTube Video Transcript:\n---\n${transcript}\n---`;
            this.logger.log(
              `Successfully fetched YouTube transcript for video ID: ${videoId}`,
            );
          } else {
            // Fallback to oEmbed if transcript fails
            const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            const response = await firstValueFrom(
              this.httpService.get(oEmbedUrl),
            );
            videoMetadata = JSON.stringify(response.data, null, 2);
            this.logger.log(
              `Fetched YouTube metadata as fallback for video ID: ${videoId}`,
            );
          }
        }
      } catch (error) {
        this.logger.warn(
          `Failed to fetch YouTube content: ${error instanceof Error ? error.message : String(error)}`,
        );
        videoMetadata = `Unable to fetch content for YouTube URL: ${videoUrl}`;
      }
    } else {
      // For non-YouTube URLs, try to download the video directly
      try {
        videoPart = await this.fetchMediaAsInlineData(videoUrl);
        this.logger.log(`Successfully downloaded video from: ${videoUrl}`);
      } catch (error) {
        this.logger.warn(
          `Failed to download video: ${error instanceof Error ? error.message : String(error)}`,
        );
        videoMetadata = `Unable to download video from URL: ${videoUrl}`;
      }
    }

    const generateResponse = async () => {
      const prompt = `You are an expert knowledge extractor. Analyze the provided video content and extract key ideas and insights.

${hintTitle ? `Source title hint: "${hintTitle}"` : ''}

Video URL: ${videoUrl}

${videoMetadata ? `Video Content:\n---\n${videoMetadata}\n---\n\n` : ''}

${isYouTube ? 'This is a YouTube video with the transcript provided above. Please analyze the transcript content thoroughly.' : 'The actual video file is provided for direct analysis.'}

Please analyze the content thoroughly, including:
- Main topics and themes discussed
- Key insights and actionable advice
- Speaker's main arguments or points
- Any significant examples or case studies
- Takeaway messages for the audience

Return ONLY valid JSON with this exact structure:
{
  "title": "Inferred or confirmed title of the source",
  "creator": "Author or creator name (null if unknown)",
  "ideas": [
    {
      "idea_text": "A clear, concise key idea from the source",
      "core": "The core theme or concept this idea belongs to (e.g. Habits, Mindset, Leadership)",
      "importance": "Why this idea matters (high/medium/low or a short sentence)",
      "application": "How this idea can be applied in real life",
      "example": "A real-world example or scenario that illustrates the idea"
    }
  ]
}

Extract between 5 and 20 of the most valuable ideas. Be specific and insightful.`;

      const responseParts: (string | Part)[] = [prompt];
      if (videoPart) {
        responseParts.push(videoPart);
      }

      const result = await model.generateContent(responseParts);
      return result.response.text();
    };

    try {
      const responseText = await generateResponse();
      return await this.validateAndRetry(
        ExtractionResultSchema,
        responseText,
        generateResponse,
      );
    } catch (e) {
      this.logger.error(
        `Gemini extraction failed: ${e instanceof Error ? e.message : String(e)}`,
      );
      throw e;
    }
  }

  private async fetchYouTubeTranscript(
    videoId: string,
  ): Promise<string | null> {
    try {
      // First, try the YouTube Data API method
      const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
      if (apiKey) {
        try {
          const transcript = await this.fetchYouTubeTranscriptViaAPI(
            videoId,
            apiKey,
          );
          if (transcript) {
            this.logger.log(
              `Successfully fetched YouTube transcript via API for video ID: ${videoId}`,
            );
            return transcript;
          }
        } catch (apiError) {
          this.logger.warn(
            `YouTube API failed for video ${videoId}: ${apiError.message}`,
          );
        }
      } else {
        this.logger.warn(
          'YOUTUBE_API_KEY not found, trying alternative method',
        );
      }

      // Fallback to alternative method (scraping or free service)
      const fallbackTranscript =
        await this.fetchYouTubeTranscriptFallback(videoId);
      if (fallbackTranscript) {
        this.logger.log(
          `Successfully fetched YouTube transcript via fallback for video ID: ${videoId}`,
        );
        return fallbackTranscript;
      }

      this.logger.warn(`No transcript available for video ${videoId}`);
      return null;
    } catch (error) {
      this.logger.error(
        `Failed to fetch YouTube transcript for ${videoId}: ${error.message}`,
      );
      return null;
    }
  }

  private async fetchYouTubeTranscriptViaAPI(
    videoId: string,
    apiKey: string,
  ): Promise<string | null> {
    try {
      // Get captions list
      const captionsUrl = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`;
      const captionsResponse = await firstValueFrom(
        this.httpService.get(captionsUrl),
      );

      const items = captionsResponse.data.items;
      if (!items || items.length === 0) {
        this.logger.warn(`No captions found for video ${videoId}`);
        return null;
      }

      // Find English caption or first available
      const englishCaption = items.find(
        (item: any) =>
          item.snippet.language === 'en' ||
          item.snippet.language.startsWith('en'),
      );
      const captionToUse = englishCaption || items[0];

      if (!captionToUse) {
        this.logger.warn(`No suitable caption found for video ${videoId}`);
        return null;
      }

      // Download caption content
      const captionUrl = `https://www.googleapis.com/youtube/v3/captions/${captionToUse.id}?key=${apiKey}`;
      const captionResponse = await firstValueFrom(
        this.httpService.get(captionUrl, {
          headers: {
            Accept: 'text/vtt',
          },
        }),
      );

      // Parse VTT format and extract text
      return this.parseVTTCaptions(captionResponse.data);
    } catch (error) {
      this.logger.error(
        `YouTube API transcript fetch failed for ${videoId}: ${error.message}`,
      );
      throw error;
    }
  }

  private async fetchYouTubeTranscriptFallback(
    videoId: string,
  ): Promise<string | null> {
    try {
      // Use a free transcript service or implement a simple scraper
      // This is a basic implementation using a public transcript service
      const transcriptUrl = `https://video.google.com/timedtext?lang=en&v=${videoId}`;

      const response = await firstValueFrom(
        this.httpService.get(transcriptUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }),
      );

      // Parse the XML response
      return this.parseXMLTranscript(response.data);
    } catch (error) {
      this.logger.warn(
        `Fallback transcript fetch failed for ${videoId}: ${error.message}`,
      );

      // As a last resort, try to get basic video info
      try {
        const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const oEmbedResponse = await firstValueFrom(
          this.httpService.get(oEmbedUrl),
        );

        return `Video Title: ${oEmbedResponse.data.title}\nAuthor: ${oEmbedResponse.data.author_name}\n\nNote: Transcript not available for this video.`;
      } catch (oEmbedError) {
        this.logger.warn(
          `Even oEmbed fallback failed for ${videoId}: ${oEmbedError.message}`,
        );
        return null;
      }
    }
  }

  private parseXMLTranscript(xmlContent: string): string {
    try {
      // Simple XML parsing for transcript data
      const textMatches = xmlContent.match(/<text[^>]*>([^<]+)<\/text>/g);
      if (!textMatches) return '';

      const textLines = textMatches
        .map((match) => {
          const textContent = match.replace(/<text[^>]*>([^<]+)<\/text>/, '$1');
          // Decode HTML entities
          return textContent
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
        })
        .filter((text) => text.length > 0);

      return textLines.join(' ');
    } catch (error) {
      this.logger.error(`Failed to parse XML transcript: ${error.message}`);
      return '';
    }
  }

  private parseVTTCaptions(vttContent: string): string {
    try {
      // Remove VTT header and timing information, extract only text
      const lines = vttContent.split('\n');
      const textLines: string[] = [];

      let inCueBlock = false;
      for (const line of lines) {
        // Skip VTT header
        if (
          line.startsWith('WEBVTT') ||
          line.startsWith('NOTE') ||
          line === ''
        ) {
          continue;
        }

        // Skip timing lines (contain -->)
        if (line.includes('-->')) {
          inCueBlock = true;
          continue;
        }

        // Skip position/alignment lines
        if (
          line.includes('position:') ||
          line.includes('align:') ||
          line.includes('line:')
        ) {
          continue;
        }

        // Extract text content
        if (inCueBlock && line.trim() && !line.match(/^\d+$/)) {
          // Remove VTT formatting tags
          const cleanText = line
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim();

          if (cleanText) {
            textLines.push(cleanText);
          }
        }
      }

      return textLines.join(' ');
    } catch (error) {
      this.logger.error(`Failed to parse VTT captions: ${error.message}`);
      return vttContent; // Return raw content if parsing fails
    }
  }

  private extractYouTubeVideoId(url: string): string | null {
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtube\.com\/embed\/([^?]+)/,
      /youtube\.com\/v\/([^?]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/shorts\/([^?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  private async fetchMediaAsInlineData(url: string): Promise<Part> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          responseType: 'arraybuffer',
          headers: { 'User-Agent': 'Mozilla/5.0' },
        }),
      );

      // Convert to base64
      const base64Data = Buffer.from(response.data).toString('base64');

      // Determine MIME type from URL extension
      let mimeType = 'application/octet-stream'; // Default

      // Image formats
      if (url.includes('.jpg') || url.includes('.jpeg'))
        mimeType = 'image/jpeg';
      else if (url.includes('.png')) mimeType = 'image/png';
      else if (url.includes('.gif')) mimeType = 'image/gif';
      else if (url.includes('.webp')) mimeType = 'image/webp';
      else if (url.includes('.svg')) mimeType = 'image/svg+xml';
      // Video formats
      else if (url.includes('.mp4')) mimeType = 'video/mp4';
      else if (url.includes('.webm')) mimeType = 'video/webm';
      else if (url.includes('.mov')) mimeType = 'video/quicktime';
      else if (url.includes('.avi')) mimeType = 'video/x-msvideo';

      return {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch media from ${url}`, error);
      throw new Error(`Could not fetch media: ${url}`);
    }
  }

  async extractQuoteFromImage(imageUrl: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: GeminiModel.GEMINI_2_5_FLASH,
    });

    const generateResponse = async () => {
      try {
        // Fetch the image as inline data
        const imagePart = await this.fetchMediaAsInlineData(imageUrl);

        const prompt = `You are an expert at extracting texts from images. 
        
        Analyze the provided image and extract ALL quotes/text present in it.
        
        Rules:
        - Extract ONLY the quotes/inspirational text, NOT names or titles
        - If there are multiple quotes, extract ALL of them
        - Separate each quote with a newline character
        - Do NOT include person names, mentor names, or any labels
        - Do not add any explanations or additional text
        - Return the quotes exactly as written in the image
        - Preserve the original formatting and punctuation
        
        The image is provided for analysis.`;

        const parts: (string | Part)[] = [prompt, imagePart];

        const result = await model.generateContent(parts);
        return result.response.text();
      } catch (error) {
        this.logger.error(
          `Failed to extract quote from image ${imageUrl}: ${error instanceof Error ? error.message : String(error)}`,
        );
        throw new Error(
          `Could not extract quote from image: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    };

    try {
      const responseText = await generateResponse();

      // Clean up the response - remove any extra formatting
      const cleanedQuote = responseText.trim().replace(/^["']|["']$/g, '');

      // Validate using Zod
      return QuoteResponseSchema.parse(cleanedQuote);
    } catch (e) {
      this.logger.error(
        `Quote extraction failed: ${e instanceof Error ? e.message : String(e)}`,
      );
      throw e;
    }
  }

  async generateMentorData(name: string): Promise<MentorData> {
    const model = this.genAI.getGenerativeModel({
      model: GeminiModel.GEMINI_2_5_FLASH,
    });

    const generateResponse = async () => {
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

      const result = await model.generateContent(prompt);
      return result.response.text();
    };

    try {
      const responseText = await generateResponse();
      return await this.validateAndRetry(
        MentorDataSchema,
        responseText,
        generateResponse,
      );
    } catch (e) {
      this.logger.error(
        `Gemini generate mentor data failed: ${e instanceof Error ? e.message : String(e)}`,
      );
      throw e;
    }
  }

  async generateContent(
    topic: string,
    platform: string,
    ideas: any[],
  ): Promise<GeneratedContent> {
    const fallbackModels = [
      GeminiModel.GEMINI_3_PRO_PREVIEW,
      GeminiModel.GEMINI_2_5_PRO,
      GeminiModel.GEMINI_2_5_FLASH_LITE,
    ];

    const generateResponse = async (modelName: string) => {
      const model = this.genAI.getGenerativeModel({
        model: modelName,
      });
      const ideasText = ideas
        .map(
          (idea, i) =>
            `Idea ${i + 1}:\nType: ${idea.type}\nText: ${idea.text}\nCore: ${idea.core || 'N/A'}\nImportance: ${idea.importance || 'N/A'}\nApplication: ${idea.application || 'N/A'}`,
        )
        .join('\n\n');

      const prompt = `You are a world-class content creator and ghostwriter.
Please generate a script/post about: "${topic}"

Platform Format: ${platform} (if Youtube, it should be a medium-to-long form engaging script; if Tiktok, it should be punchy, short, and highly engaging for a vertical short).

Here are some collected ideas and quotes to use as inspiration (you don't have to use all of them, just weave them naturally into the content where appropriate and attribute them properly if it makes sense):
${ideasText}

IMPORTANT - SPEAKING IDENTITY AND TARGET VIBE:
${SPEAKING_IDENTITY}

Write the actual content/script itself incorporating the given topic and the vibe above.
Then, analyze why this content works, provide recommended body language instructions matching this identity, suggest a tone of voice, and give it an estimated score between 0 and 100 on how well it fits.

Return ONLY valid JSON with this exact structure:
{
  "title": "A catchy title for the content",
  "platform": "${platform}",
  "content": "The actual full script or text of the content generated",
  "analysis": "Analysis of why this content works and hits the psychological marks",
  "bodyLanguage": "Recommended body language and gestures to use while delivering",
  "toneVoice": "Recommended tone of voice for the speaker",
  "score": 95
}

Return ONLY valid JSON, no explanations.`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    };

    // Retry with different models on errors (like quota limitations)
    for (let attempt = 0; attempt < 3; attempt++) {
      const modelName = fallbackModels[attempt];
      try {
        this.logger.log(
          `Attempting generate content with model: ${modelName} (attempt ${attempt + 1}/3)`,
        );
        const responseText = await generateResponse(modelName);
        return await this.validateAndRetry(
          GeneratedContentSchema,
          responseText,
          () => generateResponse(modelName),
        );
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        this.logger.warn(`Model ${modelName} failed: ${errorMessage}`);

        if (attempt < fallbackModels.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
      }
    }

    throw new Error('All content generation attempts failed');
  }
}
