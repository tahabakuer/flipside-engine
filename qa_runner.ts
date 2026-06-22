import * as fs from 'fs';
import * as path from 'path';
import { Question } from './schema.js';
import { translateQuestion } from './translator.js';
import { normalizeDirectory } from './rename.js';
import { appendQuestionsToFile } from './fileHandler.js';

async function logError(message: string) {
  const logPath = path.join(process.cwd(), 'audit.log');
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
}

async function verifyAndCorrect() {
  const enRoot = path.join(process.cwd(), 'data', 'en');
  console.log("🛠️  Dosya sistemi temizliği başlıyor...");
  await normalizeDirectory(enRoot);

  const categories = fs.readdirSync(enRoot);
  for (const cat of categories) {
    const catPath = path.join(enRoot, cat);
    if (!fs.statSync(catPath).isDirectory()) continue;

    const subcats = fs.readdirSync(catPath);
    for (const sub of subcats) {
      const filePath = path.join(catPath, sub);
      const questions: Question[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      let needsUpdate = false;
      const corrected: Question[] = [];

      console.log(`🔍 İnceleniyor: ${cat}/${sub} (${questions.length} soru)`);

      for (let i = 0; i < questions.length; i += 5) {
        const batch = questions.slice(i, i + 5);
        const processedBatch: Question[] = [];

        for (const q of batch) {
          // İngilizce olmayan karakter kontrolü (ASCII dışı)
          if (/[^\x00-\x7F]/.test(q.question)) {
            console.log(`⚠️ Hatalı veri bulundu: ${q.question.substring(0, 30)}...`);
            const fixed = await translateQuestion(q, "English");
            processedBatch.push(fixed);
            needsUpdate = true;
            await logError(`Düzeltildi: ${cat}/${sub} | Soru ID: ${q.id}`);
          } else {
            processedBatch.push(q);
          }
        }
        corrected.push(...processedBatch);
      }

      if (needsUpdate) {
        console.log(`✅ ${cat}/${sub} güncelleniyor...`);
        const tempPath = filePath + ".tmp";
        fs.writeFileSync(tempPath, JSON.stringify(corrected, null, 2));
        fs.renameSync(tempPath, filePath);
      }
    }
  }
}

verifyAndCorrect().then(() => console.log("🚀 QA süreci başarıyla tamamlandı!")).catch(console.error);