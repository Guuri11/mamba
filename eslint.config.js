import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginTypescript from "@typescript-eslint/eslint-plugin";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginFilenames from "eslint-plugin-filenames";
import eslintPluginBoundaries from "eslint-plugin-boundaries";

// TODO: File name match regex
export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            prettier: eslintPluginPrettier,
            "@typescript-eslint": eslintPluginTypescript,
            import: eslintPluginImport,
            "simple-import-sort": eslintPluginSimpleImportSort,
            filenames: eslintPluginFilenames,
            boundaries: eslintPluginBoundaries,
        },
        settings: {
            react: {
                version: "detect",
            },
            "boundaries/elements": [
                { type: "domain", pattern: "src/domain/**" },
                { type: "application", pattern: "src/application/**" },
                { type: "infrastructure", pattern: "src/infrastructure/**" },
                { type: "presentation", pattern: "src/presentation/**" },
            ],
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "prettier/prettier": "error",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "@typescript-eslint/naming-convention": [
                "error",
                { selector: "default", format: ["camelCase"] },
                { selector: "variableLike", format: ["camelCase"] },
                { selector: "function", format: ["camelCase", "PascalCase"] },
                {
                    selector: "variable",
                    modifiers: ["const"],
                    format: ["camelCase", "UPPER_CASE", "PascalCase"],
                },
                { selector: "typeLike", format: ["PascalCase"] },
                {
                    selector: "interface",
                    format: ["PascalCase"],
                    custom: { regex: "^I[A-Z]", match: false },
                },
                { selector: "enumMember", format: ["UPPER_CASE"] },
                { selector: "import", format: null },
                { selector: "parameter", trailingUnderscore: "allow", format: null },
                { selector: "objectLiteralProperty", format: null },
            ],
            "boundaries/element-types": [
                "error",
                {
                    default: "disallow",
                    rules: [
                        { from: "domain", allow: ["domain"] },
                        { from: "application", allow: ["domain", "application"] },
                        {
                            from: "infrastructure",
                            allow: ["domain", "application", "infrastructure"],
                        },
                        {
                            from: "presentation",
                            allow: ["domain", "application", "infrastructure", "presentation"],
                        },
                    ],
                },
            ],
        },
    },
);
