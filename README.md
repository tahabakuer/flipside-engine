# 🧠 Flipside Quiz Engine
"Automated intelligence for high-quality, multi-language quiz generation with self-healing data pipelines."

## 🚀 Core Capabilities
⚡ **Turbo-Mode Generation:** Leverages local hardware (LM Studio/Qwen) for autonomous, cost-free generation.  
🛡️ **Strict Quality Guardrails:** Zod-validated schema enforcement with self-correction loops.  
🌍 **Self-Healing Pipeline:** Master-data (English) centric architecture with automated QA, normalization, and translation.  
🏗️ **Modular Data Strategy:** Hierarchical, atomic storage (`data/{lang}/{category}/{subcategory}.json`).  
🔄 **Audit & Verify:** Automatic error logging and batch-based verification for 100% data integrity.

---

## 🛠️ Data Pipeline Architecture


Our engine follows a **"Master Data First, Self-Healing Later"** approach:

1. **Generation:** `bulk_runner.ts` creates the source dataset (`data/en/`).
2. **Quality Assurance:** `qa_runner.ts` normalizes file structures, enforces English language standards, and logs auditing info.
3. **Cleaning:** `cleaner.ts` removes duplicate/similar questions to maintain high quality.
4. **Translation:** `translate_runner.ts` propagates validated master data to all target languages (`tr/`, `de/`).
5. **Indexing:** `index_generator.ts` scans the entire tree for a global directory.

---

## 🚦 Getting Started

### 1️⃣ Prerequisites
- **LM Studio** running a Qwen-model on `http://localhost:1234/v1`.
- **Node.js v18+**.
- **tsx** for runtime execution.

### 2️⃣ Installation
```bash
git clone [https://github.com/tahabakuer/flipside-engine](https://github.com/tahabakuer/flipside-engine)
cd flipside-engine
npm install
npm install -D tsx

3️⃣ Running the Pipeline
Instead of running modules individually, use the master controller to trigger the full lifecycle:
npx tsx master_run.ts

⚙️ Module Reference

Script,Responsibility
master_run.ts,Orchestrates the entire pipeline.
bulk_runner.ts,Generates initial batch data.
qa_runner.ts,Normalizes paths and validates English integrity.
cleaner.ts,Performs semantic deduplication.
translate_runner.ts,Translates validated master data to target locales.
fileHandler.ts,Handles atomic file I/O and locking.

📜 Audit Log
Every time qa_runner.ts corrects data, it records the action in audit.log. Check this file to monitor AI performance and potential prompt refinements.

Built with ❤️ for global, autonomous learning content.