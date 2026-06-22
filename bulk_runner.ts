import { generateBatch } from './generator.js';
import { appendQuestionsToFile, getExistingQuestionCount } from './fileHandler.js';
import { CATEGORY_CONFIG, CategoryKey } from './config.js';
import { generateIndex } from './index_generator.js';

const TARGET_PER_SUB = 50;
const BATCH_SIZE = 5;
const LANG = 'en'; // Master dil her zaman 'en'

async function bulkRun() {
  const categories = Object.keys(CATEGORY_CONFIG) as CategoryKey[];

  for (const cat of categories) {
    console.log(`\n📂 KATEGORİ: ${cat}`);
    
    for (const sub of CATEGORY_CONFIG[cat]) {
      let currentCount = getExistingQuestionCount(LANG, cat, sub);
      
      if (currentCount >= TARGET_PER_SUB) {
        console.log(`   ⏭️ ${sub} zaten tamamlanmış (${currentCount}/${TARGET_PER_SUB}).`);
        continue;
      }

      console.log(`   🔄 İşleniyor: ${sub} (${currentCount}/${TARGET_PER_SUB})`);
      
      while (currentCount < TARGET_PER_SUB) {
        try {
          const needed = TARGET_PER_SUB - currentCount;
          const countToRequest = needed >= BATCH_SIZE ? BATCH_SIZE : needed;

          const batch = await generateBatch(cat, sub, countToRequest);
          
          if (batch && batch.length > 0) {
            appendQuestionsToFile(batch, LANG, cat, sub);
            
            currentCount = getExistingQuestionCount(LANG, cat, sub);
            console.log(`     ✅ ${batch.length} soru eklendi. Toplam: ${currentCount}`);
          } else {
            console.warn(`     ⚠️ Model boş veri döndü, bekleniyor...`);
            await new Promise(r => setTimeout(r, 2000));
          }
          
          await new Promise(r => setTimeout(r, 500)); 
        } catch (e: any) {
          console.error(`     ❌ Hata (${cat} - ${sub}):`, e.message || e);
          await new Promise(r => setTimeout(r, 3000));
        }
      }
    }
  }

  console.log("\n🏁 TÜM KATEGORİLER TAMAMLANDI!");
  console.log("📊 İndeks raporu oluşturuluyor...");
  await generateIndex(); 
}

bulkRun().catch((err) => {
  console.error("🔥 Kritik Sistem Hatası:", err);
  process.exit(1);
});