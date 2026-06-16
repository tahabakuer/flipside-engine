import { z } from 'zod';

export const QuestionSchema = z.object({
  id: z.string(),
  category: z.string(),
  subcategory: z.string(),
  difficulty: z.enum(['EASY', 'GENERAL', 'EXPERT']),
  question: z.string().min(10).max(150),
  explanation: z.string().min(10).max(250),
  options: z.array(z.string()).length(4),
  correctAnswer: z.string(),
  tags: z.array(z.string()),
  questionType: z.literal('MCQ'),
  sourceType: z.literal('generated'),
}).refine((data) => data.options.includes(data.correctAnswer), {
  message: "Correct answer must be one of the options",
  path: ["correctAnswer"],
});

export const BatchQuestionSchema = z.array(QuestionSchema);
export type Question = z.infer<typeof QuestionSchema>;