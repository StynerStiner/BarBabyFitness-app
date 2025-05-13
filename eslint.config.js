// eslint.config.js
module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended", // Integrates Prettier with ESLint
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error", // Treat Prettier issues as ESLint errors
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }], // Allow JSX in .tsx files
    "@typescript-eslint/no-unused-vars": "warn", // Warn for unused variables
    "react/react-in-jsx-scope": "off", // Not needed with React 17+
    "react/prop-types": "off", // Disable prop-types for TypeScript
  },
  settings: {
    react: {
      version: "detect", // Auto-detect React version
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Specify extensions for linting
      parser: "@typescript-eslint/parser",
      rules: {},
    },
  ],
};
