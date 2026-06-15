import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import * as dotenv from "dotenv";
import { BatchQuestionSchema, Question } from './schema';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const grok = new OpenAI({ 
  apiKey: process.env.GROK_API_KEY, 
  baseURL: "https://api.x.ai/v1" 
});

const isGrokEnabled = !!process.env.GROK_API_KEY;

export async function generateBatch(
  category: string, 
  subcategory: string, 
  count: number = 25
): Promise<Question[]> {
  
  const prompt = `
    Generate ${count} NEW unique quiz questions for: ${category} - ${subcategory}.
    Difficulty level: Mix of EASY, GENERAL, and EXPERT.
    LANGUAGE: STRICTLY ENGLISH.
    
    IMPORTANT RULES:
    1. "explanation" field MUST be shorter than 250 characters.
    2. "question" field MUST be between 10-150 characters.
    3. Return ONLY a JSON array of ${count} objects matching the schema.
    4. Do not include any markdown or text outside the JSON array.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return BatchQuestionSchema.parse(JSON.parse(result.response.text()));
  } catch (error: any) {
    if (error.status === 429) {
      console.error("🚨🚨🚨 Gemini kota doldu!🚨🚨🚨");
      process.exit(1);
    }
    

    if (isGrokEnabled) {
      console.warn("⚠️ Gemini failed. Switching to Grok...");
      const completion = await grok.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
      });
      return BatchQuestionSchema.parse(JSON.parse(completion.choices[0].message.content || "[]"));
    } else {
      console.error("❌❌❌ Gemini başarısız oldu ve Grok API anahtarı bulunamadı!❌❌❌");
      process.exit(1);
    }
  }
}