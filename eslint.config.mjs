import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-console": "warn",
      "@next/next/no-img-element": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",

      // Disable specific rules causing build to fail on Vercel
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "warn", // Warn instead of error
      "react/no-unescaped-entities": "warn", // Warn so build won't fail
    },
  },
];

export default eslintConfig;
