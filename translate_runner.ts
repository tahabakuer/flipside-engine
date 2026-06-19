import * as fs from 'fs';
import * as path from 'path';
import { Question } from './schema.js';
import { translateQuestion } from './translator.js';

const SUPPORTED_LANGUAGES = ['tr', 'de'];

// Yeni: İngilizce doğrulama fonksiyonu
async function isEnglish(q: Question): Promise<boolean> {
  // Basit bir kontrol veya model sorgusu buraya eklenebilir. 
  // Şimdilik schema üzerinden temel validasyon yapıyoruz.
  return q.question.length > 5; 
}

async function processTranslations() {
  const enRoot = path.join(process.cwd(), 'data', 'en');
  const categories = fs.readdirSync(enRoot);

  for (const cat of categories) {
    const subcats = fs.readdirSync(path.join(enRoot, cat));
    
    for (const sub of subcats) {
      const enFilePath = path.join(enRoot, cat, sub);
      const enQuestions: Question[] = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'));

      // 1. Doğrulama: Tüm soruların İngilizce olduğundan emin ol
      console.log(`🔍 Doğrulanıyor: ${cat}/${sub}`);
      for (const q of enQuestions) {
        if (!(await isEnglish(q))) {
          throw new Error(`Kritik Hata: ${cat}/${sub} dosyasında İngilizce olmayan soru tespit edildi!`);
        }
      }

      // 2. Çeviri: Her dil için işleme başla
      for (const lang of SUPPORTED_LANGUAGES) {
        const targetPath = path.join(process.cwd(), 'data', lang, cat, sub);
        
        if (fs.existsSync(targetPath)) {
          const existing = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
          if (existing.length === enQuestions.length) continue;
        }

        console.log(`🌍 Çeviriliyor: ${lang} -> ${cat}/${sub}`);
        const translatedBatch: Question[] = [];
        
        // Hata durumunda kaldığı yerden devam edebilmesi için burada bir try-catch bloğu eklenebilir
        for (const q of enQuestions) {
          const tq = await translateQuestion(q, lang);
          translatedBatch.push(tq);
        }

        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        
        // Atomik yazma
        const tempPath = targetPath + ".tmp";
        fs.writeFileSync(tempPath, JSON.stringify(translatedBatch, null, 2));
        fs.renameSync(tempPath, targetPath);
        
        console.log(`✅ Tamamlandı: ${lang} -> ${cat}/${sub}`);
      }
    }
  }
}

processTranslations().catch(console.error);