import * as fs from 'fs';
import * as path from 'path';
import { Question } from './schema.js';
import { CATEGORY_CONFIG, CategoryKey } from './config.js';

// Benzerlik fonksiyonu
function isTooSimilar(q1: string, q2: string): boolean {
  const w1 = new Set(q1.toLowerCase().replace(/[^\w\s]/g, '').split(' '));
  const w2 = new Set(q2.toLowerCase().replace(/[^\w\s]/g, '').split(' '));
  const intersection = new Set([...w1].filter(x => w2.has(x)));
  const similarity = intersection.size / Math.max(w1.size, w2.size);
  return similarity > 0.75; // %75 benzerlik eşiği
}

function cleanFile(filePath: string) {
  const data: Question[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const uniqueQuestions: Question[] = [];

  for (const q of data) {
    const isDuplicate = uniqueQuestions.some(uq => isTooSimilar(uq.question, q.question));
    if (!isDuplicate) {
      uniqueQuestions.push(q);
    }
  }

  if (uniqueQuestions.length < data.length) {
    fs.writeFileSync(filePath, JSON.stringify(uniqueQuestions, null, 2));
    console.log(`🧹 ${path.basename(filePath)} temizlendi: ${data.length - uniqueQuestions.length} benzer soru silindi.`);
  }
}

// Tüm klasörleri otomatik tara
const enRoot = path.join(process.cwd(), 'data', 'en');
const categories = Object.keys(CATEGORY_CONFIG) as CategoryKey[];

categories.forEach(cat => {
  const subcats = CATEGORY_CONFIG[cat];
  subcats.forEach(sub => {
    const filePath = path.join(enRoot, cat, `${sub.toLowerCase()}.json`);
    if (fs.existsSync(filePath)) cleanFile(filePath);
  });
});