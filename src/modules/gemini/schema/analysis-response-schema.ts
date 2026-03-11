import { z } from 'zod';

export const AnalysisResponseSchema = z.object({
  relationshipType: z.string().transform((val) => val.toLowerCase()),
  emotionAnalysis: z.object({
    user: z.object({
      summary: z.string(),
      emotions: z.record(z.string(), z.number().min(0).max(1)),
    }),
    partner: z.object({
      summary: z.string(),
      emotions: z.record(z.string(), z.number().min(0).max(1)),
    }),
    overallTone: z.string(),
  }),
  intentAnalysis: z.object({
    user: z.string(),
    partner: z.string(),
  }),
  communicationAdvice: z.string(),
  relationshipInsights: z.string(),
  redFlags: z.array(z.string()),
  healthyResponses: z.array(z.string()),
  summary: z.string(),
});
