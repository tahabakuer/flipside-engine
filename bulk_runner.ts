import { generateBatch } from './generator';
import { appendQuestionsToFile, getExistingQuestionCount } from './fileHandler';
import { CATEGORY_CONFIG, CategoryKey } from './config';

const TARGET_PER_SUB = 50; 
const BATCH_SIZE = 25;

async function bulkRun() {
  const categories = Object.keys(CATEGORY_CONFIG) as CategoryKey[];

  for (const cat of categories) {
    for (const sub of CATEGORY_CONFIG[cat]) {
      
      let currentCount = getExistingQuestionCount(cat, sub);
      
      if (currentCount >= TARGET_PER_SUB) {
        console.log(`⏭️⏭️⏭️ Geçiliyor: ${cat} -> ${sub} (Zaten ${currentCount} soru var)⏭️⏭️⏭️`);
        continue;
      }

      console.log(`\n🔄🔄🔄 Başlıyor: ${cat} -> ${sub} (Mevcut: ${currentCount} / Hedef: ${TARGET_PER_SUB}) 🔄🔄🔄`);
      
      while (currentCount < TARGET_PER_SUB) {
        try {
          const batch = await generateBatch(cat, sub, BATCH_SIZE);
          
          appendQuestionsToFile(batch, cat);
          currentCount = getExistingQuestionCount(cat, sub); // Güncel sayıyı al
          
          console.log(`✅ ${batch.length} soru eklendi. Toplam: ${currentCount}`);
          
          await new Promise(r => setTimeout(r, 2000));
          
        } catch (e) {
          console.error(`❌❌❌ Kritik Hata (${cat} - ${sub}):`, e, '❌❌❌');
          process.exit(1); 
        }
      }
    }
  }
}

bulkRun().catch(console.error);