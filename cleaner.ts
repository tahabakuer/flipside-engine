import * as fs from 'fs';
import * as path from 'path';
import { Question } from './schema.js';
import { getTranslatedName } from './translator.js';

function isTooSimilar(q1: string, q2: string): boolean {
  const w1 = new Set(q1.toLowerCase().replace(/[^\w\s]/g, '').split(' '));
  const w2 = new Set(q2.toLowerCase().replace(/[^\w\s]/g, '').split(' '));
  const intersection = new Set([...w1].filter(x => w2.has(x)));
  const similarity = intersection.size / Math.max(w1.size, w2.size);
  return similarity > 0.75; 
}

function cleanFile(filePath: string) {
  try {
    const data: Question[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const uniqueQuestions: Question[] = [];

    for (const q of data) {
      const isDuplicate = uniqueQuestions.some(uq => isTooSimilar(uq.question, q.question));
      if (!isDuplicate) {
        uniqueQuestions.push(q);
      }
    }

    if (uniqueQuestions.length < data.length) {
      const tempPath = filePath + ".tmp";
      fs.writeFileSync(tempPath, JSON.stringify(uniqueQuestions, null, 2));
      fs.renameSync(tempPath, filePath);
      console.log(`🧹 ${path.basename(filePath)} temizlendi: ${data.length - uniqueQuestions.length} benzer soru silindi.`);
    }
  } catch (e) {
    console.error(`❌ Temizleme hatası (${filePath}):`, e);
  }
}

const enRoot = path.join(process.cwd(), 'data', 'en');

function scanAndClean(dir: string) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndClean(fullPath);
    } else if (item.endsWith('.json')) {
      cleanFile(fullPath);
    }
  }
}

scanAndClean(enRoot);