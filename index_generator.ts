import fs from 'fs';
import path from 'path';

export function generateIndex() {
  const dataRoot = path.join(process.cwd(), 'data');
  const index: any[] = [];

  const languages = fs.readdirSync(dataRoot);

  for (const lang of languages) {
    const langPath = path.join(dataRoot, lang);
    if (!fs.lstatSync(langPath).isDirectory()) continue;

    const categories = fs.readdirSync(langPath);
    for (const cat of categories) {
      const catPath = path.join(langPath, cat);
      if (!fs.lstatSync(catPath).isDirectory()) continue;

      const subFiles = fs.readdirSync(catPath);
      for (const file of subFiles) {
        if (file.endsWith('.json')) {
          const filePath = path.join(catPath, file);
          const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          
          index.push({
            lang,
            category: cat,
            subcategory: file.replace('.json', ''),
            count: content.length,
            path: filePath
          });
        }
      }
    }
  }

  fs.writeFileSync(path.join(dataRoot, 'index.json'), JSON.stringify(index, null, 2));
  console.log("✅ Global İndeks güncellendi!");
}