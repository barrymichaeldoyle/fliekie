import baseConfig, { restrictEnvAccess } from "@fliekie/eslint-config/base";
import nextjsConfig from "@fliekie/eslint-config/nextjs";
import reactConfig from "@fliekie/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
