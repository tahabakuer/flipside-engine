import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateBatch } from './generator'; // Batch generator'ı kullanıyoruz
import { appendQuestionsToFile } from './fileHandler';
import { CATEGORY_CONFIG, CategoryKey } from './config';

const argv = yargs(hideBin(process.argv))
  .option('category', { type: 'string', demandOption: true, description: 'Kategori adı' })
  .option('sub', { type: 'string', demandOption: true, description: 'Alt kategori adı' })
  .option('count', { type: 'number', default: 5, description: 'Soru sayısı' })
  .parseSync();

async function runEngine() {
  const cat = argv.category as CategoryKey;
  const sub = argv.sub;
  const count = argv.count;

  if (!CATEGORY_CONFIG[cat] || !CATEGORY_CONFIG[cat].includes(sub)) {
    console.error(`❌ HATA: '${cat}' veya '${sub}' bulunamadı!`);
    return;
  }

  console.log(`🛠️ Manuel Üretim: ${cat} -> ${sub} (${count} soru)`);

  try {
    // Toplu üretim yaparak hızı artırıyoruz
    const batch = await generateBatch(cat, sub, count);
    
    appendQuestionsToFile(batch, cat);
    console.log(`✅ ${batch.length} soru başarıyla eklendi.`);
  } catch (e) {
    console.error("❌ Üretim başarısız:", e);
  }
}

runEngine();