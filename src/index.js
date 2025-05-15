const fs = require("fs");
const dotenv = require("dotenv");
const core = require("@actions/core");

const target = core.getInput("target", {
  required: false,
  trimWhitespace: true,
}) || ".env";

const example = core.getInput("example", {
  required: false,
  trimWhitespace: true,
}) || ".env.example";

const variables = core.getInput("variables", {
  required: true,
  trimWhitespace: false,
});

try {
  if (!fs.existsSync(target)) {
    console.log(`Copying ${example} to ${target}`);
    fs.copyFileSync(example, target);
  }

  const parsedVariables = JSON.parse(variables);

  // Load the existing environment file (if it exists)
  const envConfig = fs.existsSync(target)
    ? dotenv.parse(fs.readFileSync(target, "utf-8"))
    : {};

  // Merge existing variables with new ones
  const updatedConfig = { ...envConfig, ...parsedVariables };

  // Rebuild environment file content
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
  core.setFailed("Error processing the environment file");
}
