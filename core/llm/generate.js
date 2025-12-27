const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

function buildContext(chunks) {
  return chunks
    .map((c) => `FILE: ${c.file}\nROLE: ${c.role}\nCODE:\n${c.text}`)
    .join("\n\n---\n\n");
}

async function generateAnswer(taskPrompt, chunks) {
  const context = buildContext(chunks);

  const prompt = `
# ROLE
You are a Senior Backend Engineer assisting via a CLI tool. 
Your goal is to provide high-density, technical answers.

# STYLE RULES
1. **Be Concise**: No "Hello," "I hope this helps," or "Based on the code..."
2. **Technical Depth**: Focus on how the code works, not just what it does.
3. **Format**: Use strictly Markdown. Use "###" for sections.
4. **Constraint**: Use ONLY the provided context. If unsure, say "Logic not found in context."

# CONTEXTUAL DATA
${context}

# TASK
${taskPrompt}

# RESPONSE STRUCTURE (Follow this strictly):
### 🔍 Analysis
(1-2 sentences maximum explaining the relevant logic found.)

### 🚀 Implementation / Explanation
(Use a bulleted list or a small code block. Keep it focused on the solution. if need explain with code blocks for better understanding to user)

### 📂 Source References
(List the files used as bullet points: e.g., "- src/utils/auth.js")
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Handle Candidates and Safety
    const candidate = response.candidates[0];

    if (candidate.finishReason === "SAFETY") {
      return "⚠️  [LLM Error]: Content blocked by safety filters.";
    }

    if (candidate.finishReason === "RECITATION") {
      return "⚠️  [LLM Error]: Blocked due to copyright recitation detection.";
    }

    const text = response.text();
    if (!text) {
      return "⚠️  [LLM Error]: Empty response from engine.";
    }

    return text.trim();
  } catch (error) {
    return handleApiError(error);
  }
}

function handleApiError(error) {
  const message = error.message || "";
  if (message.includes("429")) {
    return "🚫 [API Quota Exceeded]: Free tier rate limit hit on Gemini. Not a CodeSense bug. 👉 Wait 60s.";
  }
  if (message.includes("401") || message.includes("403")) {
    return "🔑 [Auth Error]: Invalid Key. Run `codesense init`.";
  }
  if (message.includes("500") || message.includes("503")) {
    return "☁️  [Service Error]: Gemini servers overloaded. Try again in a moment.";
  }
  return `❌ [System Error]: ${error.message}`;
}

module.exports = generateAnswer;

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-2.5-flash",
// });

// function buildContext(chunks) {
//   return chunks
//     .map((c) => `FILE: ${c.file}\nROLE: ${c.role}\nCODE:\n${c.text}`)
//     .join("\n\n---\n\n");
// }

// async function generateAnswer(taskPrompt, chunks) {
//   const context = buildContext(chunks);

//   //     # STRUCTURED OUTPUT
//   // ### 🔍 Analysis : Brief overview of the relevant code.

//   // ### 🚀 Implementation Detail
//   // (Use code snippets from the context to support your points. Address the task directly. )

//   const prompt23 = `
//   # ROLE
// You are a senior backend engineer assisting via a Command Line Interface (CLI).

// STRICT FORMATTING RULES for Terminal:
// 1. Use clear headings with "###".
// 2. Use backticks for inline code \`like this\`.
// 3. Use code blocks with language tags for snippets.
// 4. Keep explanations concise but technically deep.
// 5. Use bullet points for steps.

// Use ONLY the provided code context.
//   # CONTEXTUAL DATA
//   ${context}

//   # TASK
//   ${taskPrompt}

// add
// ### 📂 Source References
// (List the files used to generate this answer: e.g., \`- src/controllers/auth.js\`)
//   `;

//   try {
//     // 1. Call the API
//     const result = await model.generateContent(prompt23);
//     const response = await result.response;

//     // 2. Handle "Safety" and "Finish Reason" Errors
//     // Even if the HTTP call succeeds, the model might block the output.
//     const candidate = response.candidates[0];

//     if (candidate.finishReason === "SAFETY") {
//       return "⚠️  [LLM Error]: The response was blocked by safety filters. The query might contain sensitive or prohibited content.";
//     }

//     if (candidate.finishReason === "RECITATION") {
//       return "⚠️  [LLM Error]: The model refused to answer because it detected direct recitation of copyrighted material.";
//     }

//     if (!response.text()) {
//       return "⚠️  [LLM Error]: The model returned an empty response. Try rephrasing your question.";
//     }

//     return response.text();
//   } catch (error) {
//     // 3. Handle Network/API Errors (429, 500, etc.)
//     return handleApiError(error);
//   }
// }

// /**
//  * Categorizes and formats API errors for the CLI
//  */
// function handleApiError(error) {
//   const message = error.message || "";

//   if (message.includes("429")) {
//     return `
// 🚫 [API Quota Exceeded]: You've hit the Gemini API rate limit.
//    This is a limitation of the API's free tier, not CodeSense.
//    👉 Please wait and try again.
//     `.trim();
//   }

//   if (message.includes("401") || message.includes("403")) {
//     return "🔑 [Auth Error]: Invalid API Key. The Gemini API rejected your credentials. Run `codesense init` to update it.";
//   }

//   if (message.includes("500") || message.includes("503")) {
//     return "☁️  [Service Unavailable]: Google's AI servers are currently overloaded. This is an external service issue. Please try again in a moment.";
//   }

//   if (message.includes("fetch failed")) {
//     return "🌐 [Network Error]: Could not reach Gemini API. Please check your internet connection.";
//   }

//   // Fallback for unknown errors
//   return `❌ [Unexpected System Error]: ${error.message}`;
// }
// module.exports = generateAnswer;
