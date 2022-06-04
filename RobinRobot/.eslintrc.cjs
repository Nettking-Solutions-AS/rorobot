module.exports = {
  root: true,
  env: {
    "react-native/react-native": true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-native"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
