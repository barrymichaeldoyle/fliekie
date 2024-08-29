import baseConfig from "@fliekie/eslint-config/base";
import reactConfig from "@fliekie/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
