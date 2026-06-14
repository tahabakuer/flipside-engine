# Flipside Engine

Flipside Engine is an automated quiz content generation pipeline powered by the Google Gemini API. It is designed to generate, validate, and index high-quality quiz questions programmatically.

## 🚀 Features
- **Automated Generation:** Generates quiz questions based on specific categories, subcategories, and difficulty levels.
- **Strict Validation:** Uses Zod schemas to ensure every generated question meets structural and length constraints.
- **Smart Indexing:** Automatically maintains an `index.json` file for fast content discovery and management.
- **Robust Pipeline:** Built-in error handling, retry logic with exponential backoff, and duplicate prevention.
- **JSON Enforcement:** Utilizes specific API configurations to ensure clean, parseable JSON output.

## 🛠️ Tech Stack
- **Language:** TypeScript
- **AI Model:** Google Gemini Flash
- **Validation:** Zod
- **Runtime:** Node.js

## ⚙️ Installation & Usage

# 1. Clone the repository
git clone <your-repository-url>
cd flipside-engine

# 2. Install dependencies
npm install

# 3. Configure Environment
# Create a .env file and add your API key
echo "GOOGLE_API_KEY=your_actual_api_key_here" > .env

# 4. Run the Pipeline
npx ts-node master_run.ts

📁 Project Structure
bulk_runner.ts: The core engine responsible for generating batches of questions.

cleaner.ts: Post-processing script to sanitize and format data.

index_generator.ts: Manages the data/index.json registry.

data/: Directory where generated JSON quiz files are stored.

Flipside Engine © 2026