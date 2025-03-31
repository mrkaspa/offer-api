import { defineConfig } from "eslint/config"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import globals from "globals"
import tsParser from "@typescript-eslint/parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import stylisticTs from "@stylistic/eslint-plugin-ts"
import prettier from "eslint-plugin-prettier"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname + "/src",
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    files: ["src/**/*.ts"],
    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended"
    ),

    plugins: {
      "@typescript-eslint": typescriptEslint,
      "@stylistic/ts": stylisticTs,
      "prettier": prettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },

    rules: {
      "prettier/prettier": "error",
      "@stylistic/ts/semi": ["error", "never"],
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "object-curly-spacing": ["error", "always"]
    },

    ignores: ['dist/**', 'node_modules/**', '**/*.js', '**/*.jsx']
  },
])
