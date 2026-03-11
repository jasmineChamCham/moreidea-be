import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { PrismaService } from 'src/database/services/prisma.service';
import axios from 'axios';
import { AnalysisStatus, RelationshipType } from '@prisma/client';
import { AnalysisResponseSchema } from '../schema/analysis-response-schema';
import { ChatMessageHistory } from '../dto/history.dto';
import { AppGateway } from '../../websocket/gateways/app.gateway';
import { GeminiModel, MAPPED_CHAT_MESSAGE_ROLE } from 'src/common/enum';
import { RefineCommentDto } from 'src/modules/analysis-sessions/application';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(GeminiService.name);

  constructor(
    private configService: ConfigService,
    private dbContext: PrismaService,
    @Optional() private readonly appGateway?: AppGateway,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('GEMINI_API_KEY is not set in environment variables');
    }
  }

  async generateTitle(context?: string, language?: string): Promise<string> {
    if (!this.genAI) {
      throw new Error('Gemini API is not initialized. Check GEMINI_API_KEY.');
    }

    // Initialize model specifically for this task (Fast & Cheaper)
    const model = this.genAI.getGenerativeModel({
      model: GeminiModel.GEMINI_2_5_FLASH,
    });

    if (!context) {
      const defaultTitles: Record<string, string> = {
        vi: 'Phiên phân tích mới',
        fr: "Nouvelle session d'analyse",
        it: 'Nuova sessione di analisi',
        es: 'Nueva sesión de análisis',
        en: 'New Analysis Session',
      };
      return language && defaultTitles[language]
        ? defaultTitles[language]
        : defaultTitles['en'];
    }

    const prompt = `Based on the following conversation context, generate a short, concise, and descriptive title (max 5-7 words) for an analysis session. 
    Do not use quotes, "Title:", or markdown in the response. Just the title text.
    ${language ? `\\nMake sure the generated title is in the following language code: ${language}.` : ''}
    
    Context:
    ${context}`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return text.trim();
    } catch (error) {
      this.logger.error('Error generating title with Gemini', error);
      throw new Error('Failed to generate title');
    }
  }

  async analyzeSession(
    sessionId: string,
    contextMessage?: string,
    mediaUrls?: string[],
    modelName: GeminiModel = GeminiModel.GEMINI_3_PRO_PREVIEW,
    language?: string,
  ): Promise<void> {
    if (!this.genAI) {
      throw new Error('Gemini API is not initialized. Check GEMINI_API_KEY.');
    }

    try {
      // 1. Update status to PROCESSING and get session details
      const session = await this.dbContext.analysisSession.update({
        where: { id: sessionId },
        data: { status: AnalysisStatus.processing },
        select: {
          userId: true,
          relationshipId: true,
          user: {
            select: {
              isAllowUserData: true,
              mbti: true,
              zodiacSign: true,
              loveLanguages: true,
            },
          },
        },
      });

      const userContext = this.generateUserContext(session.user);

      // 2. Prepare Model
      const model = this.genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      // 3. Prepare Prompt & Media
      const parts: (string | Part)[] = [];

      const systemPrompt = `
      You are an expert Relationship & Communication Coach, known for being empathetic, insightful, and practical.
      Your task is to analyze the attached conversation (screenshots/images) and the User's Context.

      **CRITICAL: Speaker Identification**
      Before analyzing, you MUST correctly identify who is the USER and who is the OTHER PERSON:
      
      1. **Visual Cues in Screenshots:**
         - Messages on the RIGHT side (typically in blue/colored bubbles) are usually from the USER
         - Messages on the LEFT side (typically in gray/neutral bubbles) are from the OTHER PERSON
         - Look for timestamps, profile pictures, or names to confirm identity
         - Some apps show "You" or the user's name on one side
      
      2. **Context Clues:**
         - Read the "User's Context" message carefully - the person seeking advice is the USER
         - The context often describes what the USER is experiencing or feeling
         - Pay attention to perspective: "I did X" means the USER did X, "They did Y" means the other person did Y
      
      3. **Verification Step:**
         - Before finalizing your analysis, mentally verify: "Does this emotion/action make sense for THIS speaker?"
         - Double-check you haven't swapped who said/did what
         - If uncertain, prioritize the visual layout (right = user, left = other person)
      
      **IMPORTANT: Do NOT mix up the speakers. The user's emotions should reflect the messages THEY sent, not what the other person said.**

      **Important Instructions:**
      1. **Analyze the Relationship:** Determine the relationship type between the User and the other person.
      2. **Dynamic Addressing:** Address the user directly as "You". Meaningfully refer to the other person based on the identified relationship (e.g., "Your Partner", "Your Friend", "Your Mom", "Your Ex", or simply "They" if unclear). Avoid overly formal labels if the context suggests closeness.
      3. **Tone:** Be supportive, non-judgmental, but honest. Validate the user's feelings while providing objective analysis.
      4. **Emotion Analysis:** For each person (user and partner), identify ALL prominent emotions present. Assign each emotion an intensity score between 0 and 1 (0 = not present, 1 = extremely intense). Be specific and nuanced - don't limit yourself to basic emotions.
      5. **JSON Format:** You MUST return the response in valid JSON format suitable for parsing.

      **Output Structure:**
      {
        "relationshipType": "Identify the relationship type from this list: [friend, family, colleague, partner, acquaintance, romantic, other]",
        "emotionAnalysis": { 
          "user": {
            "summary": "A detailed narrative description of what the USER (person seeking advice, messages on RIGHT) is feeling and why, based on THEIR messages.",
            "emotions": {
              "hurt": 0.8,
              "validation": 0.6,
              "disbelief": 0.7,
              "frustration": 0.5
            }
          },
          "partner": {
            "summary": "A detailed narrative description of what the OTHER PERSON (messages on LEFT) is feeling and why, based on THEIR messages.",
            "emotions": {
              "avoidance": 0.9,
              "detachment": 0.85,
              "self-focused": 0.7
            }
          },
          "overallTone": "The general emotional atmosphere of the conversation." 
        },
        "intentAnalysis": { 
          "user": "What is the USER (person seeking advice) trying to achieve?", 
          "partner": "What is the OTHER PERSON trying to achieve?" 
        },
        "communicationAdvice": "Actionable advice for the USER on how to handle this situation, addressing them directly.",
        "relationshipInsights": "Deeper insights into the dynamics.",
        "redFlags": ["List specific concerning behaviors if any."],
        "healthyResponses": ["Draft 2-3 concrete text message responses."],
        "summary": "A concise summary."
      }

      **Emotion Identification Guidelines:**
      - Identify 3-6 prominent emotions per person
      - Use specific emotion words (e.g., "betrayed", "validated", "dismissed" rather than just "sad" or "happy")
      - Assign intensity scores based on how strongly that emotion is expressed
      - Include both positive and negative emotions when present
      - The summary should provide context and explanation for the emotions identified
      - VERIFY that emotions match the correct speaker (USER vs OTHER PERSON)

      ${language ? `**CRITICAL: Output valid JSON. Keep JSON keys in English. Translate ONLY the string values to: ${language}**` : ''}
     `;

      parts.push(systemPrompt);

      if (userContext) {
        parts.push(userContext);
      }

      if (contextMessage) {
        parts.push(`\nUser's Context: ${contextMessage}`);
      }

      if (mediaUrls && mediaUrls.length > 0) {
        this.logger.log(`Fetching ${mediaUrls.length} media files...`);
        const mediaParts = await Promise.all(
          mediaUrls.map((url) => this.fetchMediaAsInlineData(url)),
        );
        parts.push(...mediaParts);
      }

      // 4. Call Gemini
      this.logger.log(`Sending request to Gemini for session ${sessionId}...`);
      const result = await model.generateContent(parts);
      const response = result.response;
      const jsonString = response.text();
      const cleanJsonString = jsonString.replace(/```json\n?|```/g, '').trim();

      // 5. Validate Gemini Response
      let analysisData = null;
      try {
        const parsedJson = JSON.parse(cleanJsonString);
        analysisData = AnalysisResponseSchema.parse(parsedJson);
      } catch (error) {
        this.logger.warn(
          `Validation failed for session ${sessionId}, retrying...`,
          error,
        );
        // Retry
        return await this.analyzeSession(
          sessionId,
          contextMessage,
          mediaUrls,
          modelName,
        );
      }

      // 6. Emit WebSocket event
      if (this.appGateway && analysisData) {
        this.logger.log(`Emitting WebSocket event for session ${sessionId}`);
        this.appGateway.notifyAnalysisComplete(sessionId, {
          sessionId,
          status: AnalysisStatus.completed,
          analysisResult: analysisData,
        });
      }

      // 7. Save result
      const extractedRelationshipType =
        analysisData.relationshipType as RelationshipType;

      const finalType: RelationshipType = Object.values(
        RelationshipType,
      ).includes(extractedRelationshipType)
        ? extractedRelationshipType
        : RelationshipType.other;

      await Promise.all([
        !session.relationshipId &&
          this.dbContext.relationship.create({
            data: {
              userId: session.userId,
              relation: finalType,
              session: { connect: { id: sessionId } },
            },
          }),

        this.dbContext.analysisResult.upsert({
          where: { sessionId: sessionId },
          create: {
            sessionId: sessionId,
            emotionAnalysis: analysisData.emotionAnalysis,
            intentAnalysis: analysisData.intentAnalysis,
            communicationAdvice: analysisData.communicationAdvice,
            relationshipInsights: analysisData.relationshipInsights,
            redFlags: analysisData.redFlags,
            healthyResponses: analysisData.healthyResponses,
            summary: analysisData.summary,
          },
          update: {
            emotionAnalysis: analysisData.emotionAnalysis,
            intentAnalysis: analysisData.intentAnalysis,
            communicationAdvice: analysisData.communicationAdvice,
            relationshipInsights: analysisData.relationshipInsights,
            redFlags: analysisData.redFlags,
            healthyResponses: analysisData.healthyResponses,
            summary: analysisData.summary,
          },
        }),
      ]);

      // 8. Update Status to COMPLETED
      await this.dbContext.analysisSession.update({
        where: { id: sessionId },
        data: { status: AnalysisStatus.completed, updatedAt: new Date() },
      });

      this.logger.log(`Analysis completed for session ${sessionId}`);
    } catch (error) {
      const failReason = error instanceof Error ? error.message : String(error);

      await this.dbContext.analysisSession.update({
        where: { id: sessionId },
        data: { status: AnalysisStatus.failed, failReason },
      });

      if (this.appGateway) {
        this.appGateway.notifyAnalysisComplete(sessionId, {
          sessionId,
          status: AnalysisStatus.failed,
          failReason,
        });
      }

      this.logger.error(`Analysis failed for session ${sessionId}`, error);
    }
  }

  private async fetchMediaAsInlineData(url: string): Promise<Part> {
    try {
      // Apply Cloudinary optimization if it's a Cloudinary URL
      let optimizedUrl = url;
      if (url.includes('res.cloudinary.com')) {
        if (url.includes('/image/upload/')) {
          // Image optimization: aggressive compression, webp/auto format, limited width
          const uploadIndex =
            url.indexOf('/image/upload/') + '/image/upload/'.length;
          if (
            !url.substring(uploadIndex).startsWith('q_') &&
            !url.substring(uploadIndex).startsWith('f_') &&
            !url.substring(uploadIndex).startsWith('w_')
          ) {
            optimizedUrl =
              url.substring(0, uploadIndex) +
              'q_auto:low,f_auto,w_1024/' +
              url.substring(uploadIndex);
            this.logger.log(`Optimized Cloudinary Image URL: ${optimizedUrl}`);
          }
        } else if (url.includes('/video/upload/')) {
          // Video optimization: very aggressive compression, standard format
          const uploadIndex =
            url.indexOf('/video/upload/') + '/video/upload/'.length;
          if (
            !url.substring(uploadIndex).startsWith('q_') &&
            !url.substring(uploadIndex).startsWith('f_') &&
            !url.substring(uploadIndex).startsWith('w_')
          ) {
            // q_auto:eco (maximum compression), vc_h264 (standard video format), w_854 (480p width approx depending on aspect ratio), fps_15 (drop frame rate)
            optimizedUrl =
              url.substring(0, uploadIndex) +
              'q_auto:eco,vc_h264,w_854,ac_none,fps_15,f_auto/' +
              url.substring(uploadIndex);
            this.logger.log(`Optimized Cloudinary Video URL: ${optimizedUrl}`);
          }
        }
      }

      const response = await axios.get(optimizedUrl, {
        responseType: 'arraybuffer',
      });
      const mimeType = response.headers['content-type'];
      const data = Buffer.from(response.data).toString('base64');

      return {
        inlineData: {
          data,
          mimeType,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch media from ${url}`, error);
      throw new Error(`Could not fetch media: ${url}`);
    }
  }

  /**
   * Builds a subtle user profile hint for the Gemini prompt.
   * Returns null if the user has opted out or has no profile data.
   */
  private generateUserContext(user: {
    isAllowUserData: boolean;
    mbti?: string | null;
    zodiacSign?: string | null;
    loveLanguages?: string[];
  }): string | null {
    if (!user?.isAllowUserData) return null;

    const lines: string[] = [];

    if (user.mbti) {
      lines.push(`MBTI: ${user.mbti}`);
    }

    if (user.zodiacSign) {
      lines.push(
        `Zodiac: ${user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1)}`,
      );
    }

    if (user.loveLanguages && user.loveLanguages.length > 0) {
      const formatted = user.loveLanguages
        .map((l) => l.replace(/_/g, ' '))
        .join(', ');
      lines.push(`Love language(s): ${formatted}`);
    }

    if (lines.length === 0) return null;

    return (
      `[Background info about the user — use this only as a subtle lens to gently personalize ` +
      `your tone and advice where naturally relevant. Do NOT make it the focus of the analysis, ` +
      `do NOT explicitly mention these traits unless prompted, and do NOT let them override ` +
      `what the conversation itself shows: ${lines.join(' | ')}]`
    );
  }

  async analyzeChatMessage(options: {
    messageId: string;
    messageBody: string;
    mediaUrls?: string[];
    analysisContext?: string;
    history?: ChatMessageHistory[];
    sessionId?: string;
    userId?: string;
  }): Promise<string> {
    const {
      messageId,
      messageBody,
      mediaUrls,
      history,
      analysisContext,
      sessionId,
      userId,
    } = options;

    if (!this.genAI) {
      this.logger.error('Gemini API is not initialized.');
      return;
    }

    try {
      let userContext: string | null = null;
      if (userId) {
        const user = await this.dbContext.user.findUnique({
          where: { id: userId },
          select: {
            isAllowUserData: true,
            mbti: true,
            zodiacSign: true,
            loveLanguages: true,
          },
        });
        userContext = user ? this.generateUserContext(user) : null;
      }

      // 1. Build system instruction
      const systemInstruction = `You are a warm, empathetic AI Relationship and Communication Coach. You help users understand their relationships and communicate more effectively.

${
  analysisContext
    ? `## Previous Analysis Context
The user has already received an analysis of their conversation. Here's the context:
${analysisContext}

Use this context to provide more personalized follow-up advice.`
    : ''
}

${userContext ? `## User Background\n${userContext}\n` : ''}

## Your Approach
- Be compassionate and non-judgmental
- Validate emotions while gently guiding toward healthier perspectives
- Use evidence-based communication techniques (I-statements, active listening, etc.)
- Help identify patterns and provide actionable suggestions
- Know when to recommend professional help for serious concerns

## Communication Style
- Warm and approachable
- Clear and practical
- Encouraging growth while respecting boundaries
- Ask clarifying questions when helpful

Remember: You're here to support, not to judge. Help users see their situations clearly and give them tools to communicate better.`;

      // 2. Prepare Model with system instruction
      const model = this.genAI.getGenerativeModel({
        model: GeminiModel.GEMINI_2_5_FLASH,
        systemInstruction,
      });

      // 3. Start chat session with structured history
      const chat = model.startChat({
        history: (history ?? []).map((msg) => ({
          role: MAPPED_CHAT_MESSAGE_ROLE[msg.role],
          parts: [{ text: msg.content }],
        })),
      });

      // 4. Build current message parts (new message + optional media)
      const currentParts: (string | Part)[] = [];

      if (mediaUrls && mediaUrls.length > 0) {
        this.logger.log(`Fetching ${mediaUrls.length} media files...`);
        const mediaParts = await Promise.all(
          mediaUrls.map((url) => this.fetchMediaAsInlineData(url)),
        );
        currentParts.push(...mediaParts);
      }

      currentParts.push(messageBody);

      // 5. Call Gemini
      this.logger.log(`Analyzing chat message ${messageId}...`);
      const result = await chat.sendMessageStream(currentParts);

      let aggregatedResponse = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        aggregatedResponse += chunkText;

        if (this.appGateway && sessionId) {
          this.appGateway.notifyChatAnalysisProgress(sessionId, {
            messageId,
            chunk: chunkText,
          });
        }
      }

      // 4. Log and Return
      this.logger.log(
        `Coach Response for message ${messageId}: ${aggregatedResponse}`,
      );
      return aggregatedResponse;
    } catch (error) {
      this.logger.error(`Error analyzing chat message ${messageId}`, error);
      throw error;
    }
  }

  async refineSession(options: {
    sessionId: string;
    contextMessage: string;
    mediaUrls: string[];
    modelName: GeminiModel;
    comments: RefineCommentDto[];
  }): Promise<void> {
    const {
      sessionId,
      contextMessage,
      mediaUrls,
      modelName = GeminiModel.GEMINI_3_PRO_PREVIEW,
      comments,
    } = options;

    if (!this.genAI) {
      throw new Error('Gemini API is not initialized. Check GEMINI_API_KEY.');
    }

    try {
      const session = await this.dbContext.analysisSession.update({
        where: { id: sessionId },
        data: { status: AnalysisStatus.processing },
        include: {
          result: true,
          user: {
            select: {
              isAllowUserData: true,
              mbti: true,
              zodiacSign: true,
              loveLanguages: true,
            },
          },
        },
      });

      if (!session.result) {
        throw new Error('No existing analysis result to refine.');
      }

      const userContext = this.generateUserContext(session.user);

      // 2. Prepare Model
      const model = this.genAI.getGenerativeModel({
        model: modelName,
      });

      // 3. Prepare Prompt
      const parts: (string | Part)[] = [];

      const systemPrompt = `
      You are an expert Relationship & Communication Coach.
      Your task is to REFINE an existing analysis based on the User's specific feedback/comments.

      **Refinement Instructions:**
      - carefully review the "Previous Analysis" and the "User's Comments".
      - The user has pointed out specific parts they agree/disagree with or want changed.
      - **CRITICAL:** Adjust the analysis to align with the user's feedback. If they say a tone was misread, correct it. If they clarify the relationship, update it.
      - Maintain the same output JSON structure as the original analysis.
      - Keep the parts of the analysis that were NOT commented on (unless they contradict the new changes).

      **Output Structure (Same as before):**
      {
        "relationshipType": "...",
        "emotionAnalysis": { ... },
        "intentAnalysis": { ... },
        "communicationAdvice": "...",
        "relationshipInsights": "...",
        "redFlags": [...],
        "healthyResponses": [...],
        "summary": "..."
      }
      `;

      parts.push(systemPrompt);

      if (userContext) {
        parts.push(userContext);
      }

      // Previous Analysis & Context
      parts.push(`
      \n*** ORIGINAL CONTEXT ***
      ${contextMessage || 'No context provided.'}

      \n*** PREVIOUS ANALYSIS RESULT ***
      ${JSON.stringify(session.result, null, 2)}
      `);

      // Media
      if (mediaUrls && mediaUrls.length > 0) {
        this.logger.log(
          `Fetching ${mediaUrls.length} media files for refinement...`,
        );
        const mediaParts = await Promise.all(
          mediaUrls.map((url) => this.fetchMediaAsInlineData(url)),
        );
        parts.push(...mediaParts);
      }

      // User Comments
      const commentsText = comments
        .map(
          (c) => `
      - On section "${c.section || 'General'}":
        Quote: "${c.quote}"
        User Feedback: "${c.text}"
      `,
        )
        .join('\n');

      parts.push(`
      \n*** USER FEEDBACK FOR REFINEMENT ***
      
      INSTRUCTION: Use the following comments ONLY to correct specific details or adjust the tone of the analysis.
      - Do NOT treat these comments as the central focus of the analysis results.
      - Do NOT make the analysis "about" these comments.
      - Just clearly incorporate the *information* provided to fix any inaccuracies in the original analysis.
      
      User's Comments:
      ${commentsText}
      `);

      // 4. Call Gemini
      this.logger.log(
        `Sending refinement request to Gemini for session ${sessionId}...`,
      );
      const result = await model.generateContent(parts);
      const response = result.response;
      const jsonString = response.text();
      const cleanJsonString = jsonString.replace(/```json\n?|```/g, '').trim();

      // 5. Validate Gemini Response
      let analysisData = null;
      try {
        const parsedJson = JSON.parse(cleanJsonString);
        analysisData = AnalysisResponseSchema.parse(parsedJson);
      } catch (error) {
        this.logger.error('Validation failed for refinement', error);
        throw error;
      }

      // 6. Emit WebSocket event
      if (this.appGateway && analysisData) {
        this.appGateway.notifyAnalysisComplete(sessionId, {
          sessionId,
          status: AnalysisStatus.completed,
          analysisResult: analysisData,
        });
      }

      // 7. Save result (Update existing or create new? we decided to update/upsert)
      const extractedRelationshipType =
        analysisData.relationshipType as RelationshipType;

      const finalType: RelationshipType = Object.values(
        RelationshipType,
      ).includes(extractedRelationshipType)
        ? extractedRelationshipType
        : RelationshipType.other;

      await Promise.all([
        this.dbContext.relationship.updateMany({
          where: { session: { id: sessionId } },
          data: { relation: finalType },
        }),

        this.dbContext.analysisResult.update({
          where: { sessionId: sessionId },
          data: {
            emotionAnalysis: analysisData.emotionAnalysis,
            intentAnalysis: analysisData.intentAnalysis,
            communicationAdvice: analysisData.communicationAdvice,
            relationshipInsights: analysisData.relationshipInsights,
            redFlags: analysisData.redFlags,
            healthyResponses: analysisData.healthyResponses,
            summary: analysisData.summary,
          },
        }),
      ]);

      // 8. Update Status to COMPLETED
      await this.dbContext.analysisSession.update({
        where: { id: sessionId },
        data: { status: AnalysisStatus.completed, updatedAt: new Date() },
      });

      this.logger.log(`Refinement completed for session ${sessionId}`);
    } catch (error) {
      const failReason = error instanceof Error ? error.message : String(error);

      await this.dbContext.analysisSession.update({
        where: { id: sessionId },
        data: { status: AnalysisStatus.failed, failReason },
      });

      if (this.appGateway) {
        this.appGateway.notifyAnalysisComplete(sessionId, {
          sessionId,
          status: AnalysisStatus.failed,
          failReason,
        });
      }

      this.logger.error(`Refinement failed for session ${sessionId}`, error);
    }
  }
}
