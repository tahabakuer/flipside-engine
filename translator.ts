import { OpenAI } from "openai";
import { Question } from "./schema.js";

const translatorLLM = new OpenAI({ 
  apiKey: "not-needed", 
  baseURL: "http://localhost:1234/v1" 
});

export const NAME_MAP: Record<string, Record<string, string>> = {
  en: {
    "bilim": "science",
    "tarih": "history",
    "spor": "sports",
    "cografya": "geography",
    "edebiyat_ve_dil": "literature_and_language",
    "hobiler_ve_oyunlar": "hobbies_and_games",
    "kulturler_ve_yasam": "cultures_and_lifestyle",
    "mutfak": "cooking",
    "sanat_ve_eglence": "arts_and_entertainment",
    "teknoloji": "technology"
  },
  tr: {
    "science": "bilim",
    "history": "tarih",
    "sports": "spor",
    "geography": "cografya",
    "literature_and_language": "edebiyat_ve_dil",
    "hobbies_and_games": "hobiler_ve_oyunlar",
    "cultures_and_lifestyle": "kulturler_ve_yasam",
    "cooking": "mutfak",
    "arts_and_entertainment": "sanat_ve_eglence",
    "technology": "teknoloji"
  },
  de: {
    "science": "wissenschaft",
    "history": "geschichte",
    "sports": "sport",
    "geography": "geographie",
    "literature_and_language": "literatur_und_sprache",
    "hobbies_and_games": "hobbys_und_spiele",
    "cultures_and_lifestyle": "kulturen_und_lebensstil",
    "cooking": "kueche",
    "arts_and_entertainment": "kunst_und_unterhaltung",
    "technology": "technologie"
  }
};

// Klasör ve dosya isimlerini NAME_MAP'ten al, yoksa olduğu gibi bırak
export function getTranslatedName(name: string, targetLang: string): string {
  return NAME_MAP[targetLang]?.[name] || name;
}

export async function translateQuestion(q: Question, targetLang: string): Promise<Question> {
  const prompt = `Translate this JSON object into ${targetLang}. 
  - Keep the original JSON structure.
  - Do NOT change 'id', 'category', 'subcategory', 'difficulty', 'questionType', 'sourceType'.
  - Translate ONLY the 'question', 'options', 'correctAnswer', and 'explanation' fields.
  - Return ONLY the raw JSON object, no other text.
  - Data: ${JSON.stringify(q)}`;

  const res = await translatorLLM.chat.completions.create({
    model: "qwen/qwen3.5-9b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1 
  });

  const content = res.choices[0].message.content || "{}";
  
  // JSON dışı tüm metinleri ve markdown işaretlerini temizle
  const cleaned = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/^[^{]*\{/, "{") // Başta JSON dışı metin varsa at
    .replace(/\}[^}]*$/, "}") // Sonda JSON dışı metin varsa at
    .trim();
  
  return JSON.parse(cleaned);
}