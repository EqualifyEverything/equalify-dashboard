/// <reference types="./types.d.ts" />

import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";

export default tseslint.config(
    {
      // Globally ignored files
      ignores: ["**/*.config.js"],
    },
    {
      files: ["**/*.js", "**/*.ts", "**/*.tsx"],
      plugins: {
        import: importPlugin,
        react: reactPlugin,
        "react-hooks": hooksPlugin,
      },
      extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
        ...reactPlugin.configs["jsx-runtime"].rules,
        ...hooksPlugin.configs.recommended.rules,
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "warn",
          { prefer: "type-imports", fixStyle: "separate-type-imports" },
        ],
        "@typescript-eslint/no-misused-promises": [
          2,
          { checksVoidReturn: { attributes: false } },
        ],
        "@typescript-eslint/no-unnecessary-condition": [
          "error",
          {
            allowConstantLoopConditions: true,
          },
        ],
        "@typescript-eslint/no-non-null-assertion": "error",
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      },
    },
    {
      linterOptions: { reportUnusedDisableDirectives: true },
      languageOptions: { 
        parserOptions: { project: true },
        globals: {
            React: "writable",
        }
     },
    },
  );