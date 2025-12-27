const fs = require("fs");
const path = require("path");
const readline = require("readline");

async function initCommand() {
  const envPath = path.join(process.cwd(), ".env");
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  let envContent = "";
  let exists = false;

  console.log("\n\x1b[1m\x1b[32mCodeSense Setup\x1b[0m");

  // 1. Check current status
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
    if (envContent.includes("GEMINI_API_KEY=")) {
      exists = true;
      console.log("ℹ️  GEMINI_API_KEY is already configured in this project.");

      const change = await askConfirmation(
        "👉 Do you want to update it? (y/N): "
      );
      if (!change) {
        console.log("✅ Keeping existing configuration.");
        return;
      }
    }
  }

  // 2. Get the new key
  console.log("\n🔑 Enter your Gemini API Key:");
  const apiKey = await askSecret("> ");

  if (!apiKey) {
    console.log("\x1b[31m❌ Error: API key cannot be empty.\x1b[0m");
    return;
  }

  // 3. Write Logic
  if (exists) {
    const updatedContent = envContent.replace(
      /GEMINI_API_KEY=.*/g,
      `GEMINI_API_KEY=${apiKey}`
    );
    fs.writeFileSync(envPath, updatedContent, { mode: 0o600 });
    console.log("✨ API Key \x1b[32mupdated\x1b[0m successfully.");
  } else {
    const prefix = envContent && !envContent.endsWith("\n") ? "\n" : "";
    fs.appendFileSync(envPath, `${prefix}GEMINI_API_KEY=${apiKey}\n`, {
      mode: 0o600,
    });
    console.log("✨ API Key \x1b[32msaved\x1b[0m to .env");
  }

  // 4. Security Polish: Check .gitignore
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    if (!gitignoreContent.includes(".env")) {
      console.log(
        "\n\x1b[33m⚠️  SECURITY WARNING:\x1b[0m .env is not in your .gitignore!"
      );
      console.log(
        "\x1b[2mPlease add '.env' to your .gitignore to keep your API key safe.\x1b[0m"
      );
    }
  }

  process.env.GEMINI_API_KEY = apiKey;
  console.log("\n✅ \x1b[1mInitialization complete!\x1b[0m\n");
}

/* ----------------------------------
   Helpers
----------------------------------- */

function askConfirmation(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      const input = answer.toLowerCase().trim();
      resolve(input === "y" || input === "yes");
    });
  });
}

function askSecret(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    process.stdout.write(prompt);
    process.stdin.setRawMode(true);

    let input = "";
    process.stdin.on("data", (char) => {
      char = char.toString();
      if (char === "\n" || char === "\r" || char === "\u0004") {
        process.stdin.setRawMode(false);
        rl.close();
        process.stdout.write("\n");
        resolve(input.trim());
      } else if (char === "\u0003") {
        // Ctrl+C
        process.exit();
      } else if (char === "\u007f") {
        // Backspace
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write("\b \b"); // Visually clear the character
        }
      } else {
        input += char;
        // process.stdout.write("*"); // Visual feedback instead of empty space
      }
    });
  });
}

module.exports = initCommand;

// const fs = require("fs");
// const path = require("path");
// const readline = require("readline");

// /**
//  * CLI: init command
//  * - Prompts for Gemini API key
//  * - Creates .env in CURRENT PROJECT (cwd)
//  * - Does NOT overwrite existing .env
//  */
// async function initCommand() {
//   const envPath = path.join(process.cwd(), ".env");
//   let envContent = "";
//   let exists = false;

//   // 1. Check current status
//   if (fs.existsSync(envPath)) {
//     envContent = fs.readFileSync(envPath, "utf8");
//     if (envContent.includes("GEMINI_API_KEY=")) {
//       exists = true;
//       console.log("ℹ️  GEMINI_API_KEY is already configured.");

//       const change = await askConfirmation(
//         "Do you want to change/update it? (y/N): "
//       );
//       if (!change) {
//         console.log("✅ Keeping existing configuration.");
//         return;
//       }
//     }
//   }

//   // 2. Get the new key
//   console.log("\n🔑 Enter your Gemini API Key");
//   const apiKey = await askSecret("> ");

//   if (!apiKey) {
//     console.log("❌ Error: API key cannot be empty.");
//     return;
//   }

//   // 3. Write Logic
//   if (exists) {
//     // Replace the existing line using Regex
//     const updatedContent = envContent.replace(
//       /GEMINI_API_KEY=.*/g,
//       `GEMINI_API_KEY=${apiKey}`
//     );
//     fs.writeFileSync(envPath, updatedContent, { mode: 0o600 });
//     console.log("✨ API Key updated successfully.");
//   } else {
//     // Append or create new
//     const prefix = envContent && !envContent.endsWith("\n") ? "\n" : "";
//     fs.appendFileSync(envPath, `${prefix}GEMINI_API_KEY=${apiKey}\n`, {
//       mode: 0o600,
//     });
//     console.log("✨ API Key saved to .env");
//   }

//   process.env.GEMINI_API_KEY = apiKey;
// }

// /**
//  * Reusing your confirmation logic for the "Update?" question
//  */
// function askConfirmation(question) {
//   return new Promise((resolve) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });

//     rl.question(question, (answer) => {
//       rl.close();
//       const input = answer.toLowerCase().trim();
//       resolve(input === "y" || input === "yes");
//     });
//   });
// }
// // async function initCommand() {
// //   const envPath = path.join(process.cwd(), ".env");
// //   let envContent = "";

// //   // 1. Read existing .env if it exists
// //   if (fs.existsSync(envPath)) {
// //     envContent = fs.readFileSync(envPath, "utf8");

// //     // Check if the key is already there
// //     if (envContent.includes("GEMINI_API_KEY=")) {
// //       console.log("ℹ️ CodeSense is already configured in this .env file.");
// //       return;
// //     }
// //     console.log(
// //       "📄 Existing .env found, but GEMINI_API_KEY is missing. Adding it now..."
// //     );
// //   }

// //   //   AIzaSyCdusAClk7Jnb4y9liVOhA_sNglROVEQwk
// //   console.log("🔑 CodeSense Initialization");
// //   const apiKey = await askSecret("Enter Gemini API Key: ");

// //   if (!apiKey) {
// //     console.log("❌ API key cannot be empty.");
// //     process.exit(1);
// //   }

// //   // 2. Append or Create
// //   const newEntry = `\nGEMINI_API_KEY=${apiKey}\n`;

// //   // Append to existing content or create new
// //   fs.appendFileSync(envPath, newEntry, { mode: 0o600 });

// //   process.env.GEMINI_API_KEY = apiKey;
// //   console.log("\n✅ Initialization complete!");
// // }

// // async function initCommand() {
// //   const envPath = path.join(process.cwd(), ".env");

// //   // Already initialized
// //   if (fs.existsSync(envPath)) {
// //     console.log("ℹ️ CodeSense already initialized in this project.");
// //     console.log("📄 .env file already exists.");
// //     return;
// //   }

// //   console.log("🔑 CodeSense Initialization");
// //   console.log("This will store your Gemini API key locally.\n");

// //   const apiKey = await askSecret("Enter Gemini API Key: ");

// //   if (!apiKey) {
// //     console.log("❌ API key cannot be empty.");
// //     process.exit(1);
// //   }

// //   const envContent = `GEMINI_API_KEY=${apiKey}\n`;

// //   // Write .env securely
// //   fs.writeFileSync(envPath, envContent, { mode: 0o600 });

// //   // Make available immediately (same shell session)
// //   process.env.GEMINI_API_KEY = apiKey;

// //   console.log("\n✅ Initialization complete!");
// //   console.log("🔒 .env file created in this project.");
// //   console.log("🚫 Do NOT commit this file to Git.");
// // }

// module.exports = initCommand;

// /* ----------------------------------
//    Helper: secure input (no echo)
// ----------------------------------- */
// function askSecret(prompt) {
//   return new Promise((resolve) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });

//     process.stdout.write(prompt);
//     process.stdin.setRawMode(true);

//     let input = "";

//     process.stdin.on("data", (char) => {
//       char = char.toString();

//       // Enter / Ctrl+D
//       if (char === "\n" || char === "\r" || char === "\u0004") {
//         process.stdin.setRawMode(false);
//         rl.close();
//         process.stdout.write("\n");
//         resolve(input.trim());
//       }
//       // Ctrl+C
//       else if (char === "\u0003") {
//         process.exit();
//       }
//       // Backspace
//       else if (char === "\u007f") {
//         input = input.slice(0, -1);
//       }
//       // Normal char
//       else {
//         input += char;
//       }
//     });
//   });
// }
