import * as fs from "fs";
import * as dotenv from "dotenv";
import * as core from "@actions/core";

const skipExample =
    core.getBooleanInput("skipExample", {
        required: false,
        trimWhitespace: true,
    }) || false;

const target =
    core.getInput("target", {
        required: false,
        trimWhitespace: true,
    }) || ".env";

const example =
    core.getInput("example", {
        required: false,
        trimWhitespace: true,
    }) || (skipExample ? false : ".env.example");

const variables = core.getInput("variables", {
    required: true,
    trimWhitespace: false,
});

try {
    const hasExample = example && fs.existsSync(example);
    const hasTarget = target && fs.existsSync(target);

    if (hasExample && !hasTarget) {
        console.log(`Copying ${example} to ${target}`);
        fs.copyFileSync(example, target);
    }

    const input: Record<string, string> = JSON.parse(variables);

    // Load the existing environment file (if it exists)
    const existent = hasTarget
        ? dotenv.parse(fs.readFileSync(target, "utf-8"))
        : {};

    // Merge existing variables with new ones
    const result = {
        ...existent,
        ...input,
    };

    const handledResult = Object.entries(result)
        .map(([key, value]) => {
            // Wrap value in quotes if it contains special characters
            const escapedValue =
                value.includes(" ") || value.includes("/")
                    ? `"${value}"`
                    : value;

            return `${key}=${escapedValue}`;
        })
        .join("\n");

    fs.writeFileSync(target, handledResult, "utf-8");

    console.log(`Updated ${target} successfully!`);
} catch (error) {
    console.error(error);
    core.setFailed("Error processing the environment file");
}
