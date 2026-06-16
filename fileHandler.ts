import * as fs from 'fs';
import * as path from 'path';
import { Question } from './schema.js';

// Artık lang parametresi zorunlu. Tüm yollar buna göre kurulur.
function getPath(lang: string, category: string, subcategory: string): string {
  const dir = path.join(process.cwd(), 'data', lang, category.toLowerCase());
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  return path.join(dir, `${subcategory.toLowerCase()}.json`);
}

export function appendQuestionsToFile(newQuestions: Question[], lang: string, category: string, subcategory: string): void {
  const filePath = getPath(lang, category, subcategory);
  const tempPath = filePath + ".tmp";
  
  let existingData: Question[] = [];
  if (fs.existsSync(filePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch { /* Hatalı dosya varsa boş başla */ }
  }

  const updatedData = [...existingData, ...newQuestions];
  
  fs.writeFileSync(tempPath, JSON.stringify(updatedData, null, 2));
  fs.renameSync(tempPath, filePath);
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