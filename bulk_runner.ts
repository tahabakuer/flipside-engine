import { generateQuestion } from './generator';
import { appendQuestionsToFile } from './fileHandler';
import { CATEGORY_CONFIG, CategoryKey } from './config';
import { Question } from './schema';

const QUESTIONS_PER_SUB = 5;
const MEMORY_SIZE = 10; // Gemini'ın "hatırlayacağı" son soru sayısı
const DELAY_MS = 2000; // API hızı için güvenli boşluk

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function bulkRun() {
  const categories = Object.keys(CATEGORY_CONFIG) as CategoryKey[];

  for (const cat of categories) {
    for (const sub of CATEGORY_CONFIG[cat]) {
      console.log(`\n🔄 Başlıyor: ${cat} -> ${sub}🔄`);
      
      let produced = 0;
      let memory: string[] = []; // Soru başlıklarını tutacağımız kısa süreli bellek

      while (produced < QUESTIONS_PER_SUB) {
        try {
          const diff = produced < 40 ? 'EASY' : produced < 70 ? 'GENERAL' : 'EXPERT';
          
          // Gemini'a önceki soruları paslıyoruz
          const q = await generateQuestion(cat, sub, diff, memory);
          
          appendQuestionsToFile([q], cat);
          
          // Belleği güncelle
          memory.push(q.question);
          if (memory.length > MEMORY_SIZE) memory.shift();
          
          produced++;
          console.log(`[${produced}/${QUESTIONS_PER_SUB}] Üretildi: ${q.question.slice(0, 40)}...`);
          
          await sleep(DELAY_MS);
        } catch (e) {
          console.error(`❌❌❌ Hata (${sub}): ${e}. 15 saniye bekleniyor...❌❌❌`);
          await sleep(15000);
        }
      }
    }
  }
}

bulkRun().catch(console.error);