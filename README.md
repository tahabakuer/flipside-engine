# 🧠 Flipside Quiz Engine
"Automated intelligence for high-quality, multi-language quiz generation."

## 🚀 Core Capabilities
⚡ **Turbo-Mode Generation:** Leverages local hardware (LM Studio/Qwen) for autonomous, cost-free generation.  
🛡️ **Strict Quality Guardrails:** Zod-validated schema enforcement with self-correction loops.  
🌍 **Multi-Language Pipeline:** Master-data based architecture; generate in English, translate to any language automatically.  
🏗️ **Modular Data Strategy:** Hierarchical storage system (`data/{lang}/{category}/{subcategory}.json`).  
🔄 **Self-Healing:** Automatic retry logic for parsing errors and constraint violations.

---

## 🛠️ Tech Stack
| Module | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | Node.js / TypeScript | Execution engine |
| **AI Engine** | LM Studio (Qwen) | Local inference |
| **Validation** | Zod | Schema enforcement |
| **Storage** | Atomic FS | Secure data persistence |
| **Translation**| LLM-based Pipeline | Cross-language sync |

---

## 📡 System Architecture


The engine follows a **"Data First, Localization Later"** approach:
1. **Master Generation:** `bulk_runner.ts` creates the source dataset (`data/en/`).
2. **Translation Pipeline:** `translate_runner.ts` syncs master data to target languages (`tr/`, `de/`, etc.).
3. **Indexing:** `index_generator.ts` scans the entire tree for a global dashboard.

---

## 🚦 Getting Started

### 1️⃣ Prerequisites
- LM Studio running a Qwen-model on `localhost:1234`.
- Node.js v18+.

### 2️⃣ Installation
```bash
git clone [https://github.com/tahabakuer/flipside-engine](https://github.com/tahabakuer/flipside-engine)
cd flipside-engine
npm install