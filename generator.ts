import { OpenAI } from "openai";
import { BatchQuestionSchema, Question } from './schema.js';
import * as dotenv from "dotenv";

dotenv.config();

const localLLM = new OpenAI({ 
  apiKey: "not-needed", 
  baseURL: "http://localhost:1234/v1" 
});

export async function generateBatch(
  category: string, subcategory: string, count: number = 25, attempt: number = 1
): Promise<Question[]> {
  try {
    const completion = await localLLM.chat.completions.create({
      model: "qwen/qwen3.5-9b", 
      messages: [
  { 
    role: "system", 
    content: "You are a professional quiz engine. You MUST output ONLY a valid JSON array of objects. Each object MUST contain: 'question' (string), 'options' (array of strings), 'correctAnswer' (string), 'difficulty' ('EASY'|'GENERAL'|'EXPERT'), 'tags' (array of strings), 'explanation' (string)." 
  },
  { 
    role: "user", 
    content: `Generate ${count} MCQ questions for topic: ${category}-${subcategory}. Return clean JSON.` 
  }
  ],
      temperature: 0.7,
    });

    const rawContent = (completion.choices[0].message.content || "[]")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(rawContent);
    const normalized = Array.isArray(parsed) ? parsed : [parsed];

    const sanitized = normalized.map(q => ({
      ...q,
      // Zorunlu ID ve Tipler
      id: String(q.id || Math.random().toString(36).substr(2, 9)),
      category: category,
      subcategory: subcategory,
      questionType: 'MCQ',
      sourceType: 'generated',
      
      // ŞEMA GÜVENLİĞİ: Eğer model boş döndüyse biz dolduruyoruz
      question: q.question || "Soru metni üretilemedi.",
      difficulty: ["EASY", "GENERAL", "EXPERT"].includes(q.difficulty) ? q.difficulty : "GENERAL",
      
      // Array zorlamaları
      options: Array.isArray(q.options) ? q.options : ["A", "B", "C", "D"],
      tags: Array.isArray(q.tags) ? q.tags : ["genel"],
      
      // String zorlamaları
      correctAnswer: String(q.correctAnswer || "A"),
      explanation: q.explanation ? String(q.explanation).substring(0, 245) : "Açıklama üretilmedi."
    }));

    return BatchQuestionSchema.parse(sanitized);

  } catch (e: any) {
    console.error(`DEBUG - Hata (${category}/${subcategory}):`, e.message);
    
    if (attempt < 3) {
      console.warn(`⚠️ Hata (Deneme ${attempt}/3). Tekrar deneniyor...`);
      await new Promise(r => setTimeout(r, 2000));
      return generateBatch(category, subcategory, count, attempt + 1);
    }
    return [];
  }
}