import * as fs from 'fs';
import * as path from 'path';
import { translateQuestion } from './translator.js';

async function processTranslations() {
  const enRoot = path.join(process.cwd(), 'data', 'en');
  const targetLangs = ['tr', 'de'];

  for (const lang of targetLangs) {

  }
}