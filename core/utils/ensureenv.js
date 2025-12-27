function ensureEnv() {
  if (!process.env.GEMINI_API_KEY) {
    console.log("❌ Gemini API key not configured.");
    console.log("👉 Run `codesense init` to set it up.");
    process.exit(1);
  }
}

module.exports = ensureEnv;
