// rename.ts
import * as fs from 'fs';
import * as path from 'path';
import { translateQuestion } from './translator.js';
import { Question } from './schema.js';

export async function normalizeDirectory(dir: string) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      await normalizeDirectory(fullPath);
      const newName = (await getEnglishName(item)).toLowerCase().replace(/\s+/g, '_');
      const newPath = path.join(path.dirname(dir), newName);
      if (item !== newName) {
        fs.renameSync(fullPath, newPath);
        console.log(`📂 Klasör yeniden adlandırıldı: ${item} -> ${newName}`);
      }
    } else if (item.endsWith('.json')) {
      const newName = (await getEnglishName(item.replace('.json', ''))).toLowerCase().replace(/\s+/g, '_') + '.json';
      const newPath = path.join(dir, newName);
      if (item !== newName) {
        fs.renameSync(fullPath, newPath);
        console.log(`📄 Dosya yeniden adlandırıldı: ${item} -> ${newName}`);
      }
    }
  }
}

async function getEnglishName(name: string): Promise<string> {
  const res = await translateQuestion({ question: name } as Question, "English");
  return res.question;
}