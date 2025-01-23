const fs = require("fs");
const dotenv = require("dotenv");
const core = require("@actions/core");

const target = core.getInput("target") || ".env";
const example = core.getInput("example") || ".env.example";
const variables = core.getInput("variables");

try {
  if (!fs.existsSync(target)) {
    console.log(`Copying ${example} to ${target}`);
    fs.copyFileSync(example, target);
  }

  const parsedVariables = JSON.parse(variables);

  // Load the existing .env file (if it exists)
  const envConfig = fs.existsSync(target)
    ? dotenv.parse(fs.readFileSync(target, "utf-8"))
    : {};

  // Merge existing variables with new ones
  const updatedConfig = { ...envConfig, ...parsedVariables };

  // Rebuild .env content
  const updatedContent = Object.entries(updatedConfig)
    .map(([key, value]) => {
      // Wrap value in quotes if it contains spaces
      const escapedValue = value.includes(" ") ? `"${value}"` : value;
      return `${key}=${escapedValue}`;
    })
    .join("\n");

  fs.writeFileSync(target, updatedContent, "utf-8");

  console.log(`Updated ${target} successfully!`);
} catch (error) {
  console.error(error);
  core.setFailed("Error processing the .env file");
}
