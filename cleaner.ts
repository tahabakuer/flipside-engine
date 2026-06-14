import * as fs from 'fs';
import * as path from 'path';
import { Question } from './schema';

function cleanDuplicates(category: string) {
  const filePath = path.join(__dirname, 'data', `${category.toLowerCase()}.json`);
  
  if (!fs.existsSync(filePath)) return;

  const rawData: Question[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // Soru metinlerini kullanarak eşsiz (unique) soruları filtrele
  const seen = new Set<string>();
  const uniqueQuestions: Question[] = [];

  for (const q of rawData) {
    // Soru metnini küçük harfe çevirip boşlukları kırparak temiz bir anahtar oluştur
    const key = q.question.toLowerCase().trim();
    
    if (!seen.has(key)) {
      seen.add(key);
      uniqueQuestions.push(q);
    }
  }

  if (uniqueQuestions.length < rawData.length) {
    fs.writeFileSync(filePath, JSON.stringify(uniqueQuestions, null, 2));
    console.log(`🧹🧹🧹🧹 Temizlik bitti: ${rawData.length - uniqueQuestions.length} kopya silindi.🧹🧹🧹`);
  } else {
    console.log(`✅ ${category} içinde kopya bulunamadı.✅✅✅`);
  }
}

const categories = ['TEKNOLOJİ', 'SPOR', 'TARİH', 'COĞRAFYA', 'BİLİM', 'MUTFAK', 'SANAT_VE_EĞLENCE', 'EDEBİYAT_VE_DİL', 'KÜLTÜRLER_VE_YAŞAM', 'HOBİLER_VE_OYUNLAR'];
categories.forEach(cleanDuplicates);