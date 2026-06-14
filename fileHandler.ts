import * as fs from 'fs';
import * as path from 'path';
import { Question } from './schema';

export function appendQuestionsToFile(newQuestions: Question[], category: string) {
  const dirPath = path.join(__dirname, 'data');
  const filePath = path.join(dirPath, `${category.toLowerCase()}.json`);

  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

  let existingQuestions: Question[] = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    existingQuestions = JSON.parse(fileContent || "[]");
  }

  const updatedQuestions = [...existingQuestions, ...newQuestions];
  fs.writeFileSync(filePath, JSON.stringify(updatedQuestions, null, 2));
  console.log(`✅ ${newQuestions.length} soru ${filePath} dosyasına eklendi.`);
}