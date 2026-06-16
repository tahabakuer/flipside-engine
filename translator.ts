import { OpenAI } from "openai";
import { Question } from "./schema.js";

const translatorLLM = new OpenAI({ 
  apiKey: "not-needed", 
  baseURL: "http://localhost:1234/v1" 
});

export async function translateQuestion(q: Question, targetLang: string): Promise<Question> {
  const prompt = `Translate this JSON object into ${targetLang}. 
  - Keep the original JSON structure.
  - Do NOT change 'id', 'category', 'subcategory', 'difficulty', 'questionType', 'sourceType'.
  - Translate ONLY the 'question', 'options', 'correctAnswer', and 'explanation' fields.
  - Return ONLY the raw JSON object.
  - Data: ${JSON.stringify(q)}`;

  const res = await translatorLLM.chat.completions.create({
    model: "qwen/qwen3.5-9b", // Veya kullandığın diğer model
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1 // Çeviride "yaratıcılık" istemiyoruz, sadakat istiyoruz
  });

  const content = res.choices[0].message.content || "{}";
  // JSON dışı metinleri temizle
  const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
  
  return JSON.parse(cleaned);
}