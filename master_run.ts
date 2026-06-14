import { execSync } from 'child_process';
import * as child_process from 'child_process';

child_process.execSync('npx ts-node bulk_runner.ts', { stdio: 'inherit' });

try {
  console.log("🚀🚀🚀 Soru Üretimi Başlıyor...🚀🚀🚀");
  execSync('npx ts-node bulk_runner.ts', { stdio: 'inherit' });

  console.log("🧹🧹🧹 Temizlik Başlıyor...🧹🧹🧹");
  execSync('npx ts-node cleaner.ts', { stdio: 'inherit' });

  console.log("📊📊📊 İndeksleme Başlıyor...📊📊📊 ");
  execSync('npx ts-node index_generator.ts', { stdio: 'inherit' });

  console.log("🎉🎉🎉 Tüm süreç başarıyla tamamlandı!🎉🎉🎉");
} catch (error) {
  console.error("❌❌❌ İşlem sırasında bir hata oluştu:", error,"❌❌❌");
}