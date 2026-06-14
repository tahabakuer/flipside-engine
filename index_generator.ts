import * as fs from 'fs';
import * as path from 'path';

function generateIndex() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'index.json');
  
  const index = files.map(file => {
    const filePath = path.join(dataDir, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return {
        category: file.replace('.json', '').toUpperCase(),
        count: Array.isArray(content) ? content.length : 0, // Dosya dizi mi diye kontrol et
        file: file
      };
    } catch (e) {
      console.error(`⚠️⚠️⚠️ ${file} dosyası hatalı, atlanıyor.⚠️⚠️⚠️`);
      return null;
    }
  }).filter(item => item !== null);

  const indexData = {
    totalCategories: index.length,
    totalQuestions: index.reduce((sum, item) => (sum || 0) + (item?.count || 0), 0),
    lastUpdated: new Date().toISOString(),
    data: index
  };

  fs.writeFileSync(path.join(dataDir, 'index.json'), JSON.stringify(indexData, null, 2));
  console.log("✅✅✅ index.json başarıyla oluşturuldu.✅✅✅");
}

generateIndex();