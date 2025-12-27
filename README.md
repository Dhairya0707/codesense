# 🚀 CodeSense

> **Local Code Intelligence for Developers** — _Powered by RAG & Gemini 2.5 Flash_

**CodeSense** is a command-line interface (CLI) tool that brings AI-powered code intelligence to your local machine. By indexing your codebase into a local vector database, CodeSense allows you to ask natural language questions about your project, generating technically accurate answers without uploading your entire source code to the cloud.

Built with a **Privacy-First** and **Frugal** architecture, using local embeddings and the efficient Gemini 2.5 Flash model.

---

## ✨ Features

- **🧠 RAG Architecture**: Retrieval-Augmented Generation ensures answers are based on _your_ actual code, not generic training data.
- **🔒 Privacy-First**: Your codebase is indexed and stored locally (`.codesense/`). Only relevant snippets are sent to the LLM for analysis.
- **⚡ Frugal & Fast**: Optimized for the Gemini Free Tier. Uses smart caching, file filtering, and the lightweight Flash model.
- **📂 Smart Indexing**: Automatically ignores noise (node_modules, dist, locks) and categorizes files by role (Controller, Route, Service).
- **📝 Auto-Documentation**: Generate comprehensive `README.md` files based on your project's actual structure and logic.
- **💻 100% CLI**: Works entirely from your terminal. No UI, no bloat.

---

## 🏗️ Architecture

CodeSense follows a modular pipeline to transform raw code into actionable intelligence:

1. **Ingestion**: Scans the repo, filters ignored files, and assigns semantic roles (e.g., `auth.controller.js` → `ROLE: controller`).
2. **Vectorization**: Chunks code into segments and generates embeddings via `text-embedding-004`.
3. **Storage**: Saves vectors locally using **Vectra** (no external DB required).
4. **Retrieval**: When you ask a question, it finds the top 4 relevant chunks via cosine similarity.
5. **Generation**: Sends the strict context to **Gemini 1.5 Flash** to generate a developer-focused answer.

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js v20+
- A Google Gemini API Key (Free)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/codesense.git
cd codesense
npm install

```

### 2. Link Globally

To use the `codesense` command from anywhere in your terminal:

```bash
npm link

```

### 3. Initialize

Navigate to the project you want to analyze and run:

```bash
codesense init

```

_This will securely prompt for your API Key and create a local `.env` file._

---

## 🚀 Usage Workflow

### Step 1: Index Your Codebase

Before you can ask questions, CodeSense needs to read your map. Run this in your project root:

```bash
codesense index

```

- **What it does:** Scans your files, generates embeddings, and saves them to `.codesense/vectordb`.
- **Note:** Run this again whenever you make significant code changes.

### Step 2: Chat with Your Code

Now, ask any technical question:

```bash
codesense ask "How does the authentication middleware work?"

```

- **Output:** You will get a markdown-formatted answer with code references and logic explanation.

### Step 3: Generate Documentation

Need to write a README? Let CodeSense do the heavy lifting:

```bash
codesense readme

```

- **Output:** Generates a `README_AI.md` file based on your current project structure.

---

## 📚 Command Reference

| Command                   | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `codesense init`          | Setup API keys and environment.                  |
| `codesense index`         | Scan and vectorize the current repository.       |
| `codesense ask "<query>"` | Query your codebase using natural language.      |
| `codesense readme`        | Generate a technical README based on context.    |
| `codesense status`        | View index health, file count, and storage size. |
| `codesense reset`         | Wipes the local vector database and index state. |

---

## 📁 Project Structure

CodeSense is self-documenting. Here is the architecture of the tool itself:

```text
.
├── bin/
│   └── codesense.js          # CLI Entry Point
├── commands/                 # Command Handlers
│   ├── init.js               # Key Management
│   ├── index.js              # Ingestion Logic
│   ├── ask.js                # RAG Orchestration
│   └── readme.js             # Doc Generation
├── core/
│   ├── ingest/               # Scanning & Chunking
│   │   ├── scanRepo.js       # Recursive File Scan
│   │   ├── filter.js         # Role Assignment & Filtering
│   │   └── chunker.js        # Text Segmentation
│   ├── rag/                  # Vector Logic
│   │   ├── vector.js         # Vectra DB Wrapper
│   │   └── retrieve.js       # Semantic Search
│   └── llm/                  # AI Integration
│       └── generate.js       # Gemini API Handler
└── package.json

```

---

## 🛡️ Privacy & Security

- **Local Storage**: Your vector database lives in `.codesense/` on your machine. It is never uploaded to any cloud.
- **Ephemeral Context**: Only the specific code chunks relevant to your question are sent to the Gemini API for processing.
- **API Key Safety**: Your key is stored in a local `.env` file. The `init` command warns you if `.env` is not in your `.gitignore`.

---

## 🤝 Contributing

Contributions are welcome! This is a **Free & Open Source** project built to help developers work smarter.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes.
4. Open a Pull Request.

---

### 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

> **Built with ❤️ by Dhairya**
