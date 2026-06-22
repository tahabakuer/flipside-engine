import * as fs from 'fs';
import * as path from 'path';
import { Question } from './schema.js';
import { getTranslatedName } from './translator.js';

// Dosya yollarını NAME_MAP üzerinden normalize eder
function getPath(lang: string, category: string, subcategory: string): string {
  // Klasör ve dosya isimlerini hedef dile göre al (örn: "science" -> "bilim")
  const cat = getTranslatedName(category.toLowerCase(), lang);
  const sub = getTranslatedName(subcategory.toLowerCase().replace('.json', ''), lang);
  
  const dir = path.join(process.cwd(), 'data', lang, cat);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  return path.join(dir, `${sub}.json`);
}

export function appendQuestionsToFile(newQuestions: Question[], lang: string, category: string, subcategory: string): void {
  const filePath = getPath(lang, category, subcategory);
  const tempPath = filePath + ".tmp";
  
  let existingData: Question[] = [];
  if (fs.existsSync(filePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error(`❌ Dosya okuma hatası (${filePath}):`, e);
    }
  }

  const updatedData = [...existingData, ...newQuestions];
  
  try {
    fs.writeFileSync(tempPath, JSON.stringify(updatedData, null, 2));
    // Windows'ta bazen dosya kilitli olabilir, küçük bir hata yönetimi
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); 
    fs.renameSync(tempPath, filePath);
  } catch (e) {
    console.error(`❌ Yazma hatası (${filePath}):`, e);
  }
}

export function getExistingQuestionCount(lang: string, category: string, subcategory: string): number {
  const filePath = getPath(lang, category, subcategory);
  if (!fs.existsSync(filePath)) return 0;
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const questions: Question[] = JSON.parse(fileContent);
    return Array.isArray(questions) ? questions.length : 0;
  } catch (e) {
    return 0;
  }
}