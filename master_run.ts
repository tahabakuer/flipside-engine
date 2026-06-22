import { execSync } from 'child_process';

async function runPipeline() {
  try {
    console.log("🚀🚀🚀 1. Soru Üretimi Başlıyor (Bulk Runner)... 🚀🚀🚀");
    execSync('npx tsx bulk_runner.ts', { stdio: 'inherit' });

    console.log("🛠️🛠️🛠️ 2. Kalite Kontrol ve Normalizasyon Başlıyor (QA Runner)... 🛠️🛠️🛠️");
    execSync('npx tsx qa_runner.ts', { stdio: 'inherit' });

    console.log("🧹🧹🧹 3. Benzerlik Temizliği Başlıyor (Cleaner)... 🧹🧹🧹");
    execSync('npx tsx cleaner.ts', { stdio: 'inherit' });

    console.log("🌍🌍🌍 4. Hedef Dillere Çeviri Başlıyor (Translate Runner)... 🌍🌍🌍");
    execSync('npx tsx translate_runner.ts', { stdio: 'inherit' });

    console.log("📊📊📊 5. İndeksleme Başlıyor (Index Generator)... 📊📊📊 ");
    execSync('npx tsx index_generator.ts', { stdio: 'inherit' });

    console.log("🎉🎉🎉 TÜM SÜREÇ BAŞARIYLA TAMAMLANDI! 🎉🎉🎉");
  } catch (error) {
    console.error("❌❌❌ İşlem sırasında kritik bir hata oluştu. Pipeline durduruldu. ❌❌❌");
    process.exit(1);
  }
}

runPipeline();