import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { QuestionSchema, Question } from './schema';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function generateQuestion(
  category: string, 
  subcategory: string, 
  difficulty: string, 
  previousQuestions: string[] = []
): Promise<Question> {
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" } 
  });

  const prompt = `
      Generate one NEW quiz question for: ${category} - ${subcategory}. Difficulty: ${difficulty}. 
      LANGUAGE: The question, options, and explanation MUST be strictly in ENGLISH.
      
      ${previousQuestions.length > 0 ? `DO NOT repeat these questions: ${previousQuestions.join('; ')}` : ''}
      
      IMPORTANT RULES:
      1. Question text MUST be between 20 and 140 characters.
      2. Explanation MUST be a single, concise sentence in ENGLISH.
      3. Return ONLY a JSON object following this structure: 
      {
        "id": "string",
        "category": "string",
        "subcategory": "string",
        "difficulty": "EASY | GENERAL | EXPERT",
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": "string",
        "explanation": "string",
        "tags": ["string"],
        "questionType": "MCQ",
        "sourceType": "generated"
      }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawData = JSON.parse(response.text());

  return QuestionSchema.parse(rawData);
}

export async function generateBatch(category: string, subcategory: string) {
  const distribution = [
    { difficulty: 'EASY', count: 2 },
    { difficulty: 'GENERAL', count: 1 },
    { difficulty: 'EXPERT', count: 2 }
  ];

  const batch: Question[] = [];
  console.log(`Generating batch for: ${category} - ${subcategory}...`);

  for (const item of distribution) {
    for (let i = 0; i < item.count; i++) {
      const q = await generateQuestion(category, subcategory, item.difficulty);
      batch.push(q);
    }
  }
  return batch;
}