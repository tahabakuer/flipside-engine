import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateQuestion } from './generator';
import { appendQuestionsToFile } from './fileHandler';
import { CATEGORY_CONFIG } from './config';

const argv = yargs(hideBin(process.argv))
  .option('category', { type: 'string', demandOption: true, description: 'Kategori adı' })
  .option('sub', { type: 'string', demandOption: true, description: 'Alt kategori adı' })
  .parseSync();

async function runEngine() {
  const cat = argv.category as keyof typeof CATEGORY_CONFIG;
  const sub = argv.sub;

  // Validasyon
  if (!CATEGORY_CONFIG[cat] || !CATEGORY_CONFIG[cat].includes(sub)) {
    console.error(`❌ HATA: '${cat}' veya '${sub}' bulunamadı!`);
    console.log("Mevcut kategoriler:", Object.keys(CATEGORY_CONFIG));
    return;
  }

  console.log(` Üretim: ${cat} -> ${sub}`);

  const distribution = [
    { difficulty: 'EASY', count: 2 },
    { difficulty: 'GENERAL', count: 1 },
    { difficulty: 'EXPERT', count: 2 }
  ];

  const batch = [];
  for (const item of distribution) {
    for (let i = 0; i < item.count; i++) {
      console.log(`Üretiliyor: ${item.difficulty}...`);
      const q = await generateQuestion(cat, sub, item.difficulty);
      batch.push(q);
    }
  }

  appendQuestionsToFile(batch, cat);
  console.log(`✅ ${batch.length} soru başarıyla eklendi.`);
}

runEngine();