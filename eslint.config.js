const js = require("@eslint/js");
const globals = require("globals");
const prettierConfig = require("eslint-config-prettier");
const tseslint = require("typescript-eslint");

module.exports = [
  {
    ignores: ["dist", "node_modules", "types", "build.ts"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.node,
        PropertiesService: "readonly",
        SpreadsheetApp: "readonly",
        GoogleAppsScript: "readonly",
        UrlFetchApp: "readonly",
        OAuth2: "readonly",
        Utilities: "readonly",
        HtmlService: "readonly",
        FetchApp: "readonly",
        DriveApp: "readonly",
      },
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-var": "error",
      ...prettierConfig.rules,
    },
  },
];
