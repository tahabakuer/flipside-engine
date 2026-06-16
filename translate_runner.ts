import * as fs from 'fs';
import * as path from 'path';
import { Question } from './schema.js';
import { translateQuestion } from './translator.js';

const SUPPORTED_LANGUAGES = ['tr', 'de']; // Eklenecek diller

async function processTranslations() {
  const enRoot = path.join(process.cwd(), 'data', 'en');
  
  // Tüm kategori ve alt kategorileri tara
  const categories = fs.readdirSync(enRoot);

  for (const cat of categories) {
    const subcats = fs.readdirSync(path.join(enRoot, cat));
    
    for (const sub of subcats) {
      const enFilePath = path.join(enRoot, cat, sub);
      const enQuestions: Question[] = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'));

      for (const lang of SUPPORTED_LANGUAGES) {
        const targetPath = path.join(process.cwd(), 'data', lang, cat, sub);
        
        // Eğer dosya zaten varsa ve soru sayısı eşitse atla (Zaten çevrilmiş)
        if (fs.existsSync(targetPath)) {
          const existing = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
          if (existing.length === enQuestions.length) continue;
        }

        console.log(`🌍 Çeviriliyor: ${lang} -> ${cat}/${sub}`);
        const translatedBatch = [];
        
        for (const q of enQuestions) {
          const tq = await translateQuestion(q, lang);
          translatedBatch.push(tq);
        }

        // Klasörü oluştur ve yaz
        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        fs.writeFileSync(targetPath, JSON.stringify(translatedBatch, null, 2));
      }
    }
  }
}

processTranslations().catch(console.error);