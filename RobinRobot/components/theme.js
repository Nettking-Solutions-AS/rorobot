import { extendTheme } from "native-base";

const theme = extendTheme({
  colors: {
    // Farger
    primary: {
      50: "#222831",
      100: "#fff",
      150: "#000",
    },
    secondary: {
      50: "#393E46",
    },
    tertiary: {
      50: "#EEEEEE",
    },
    accent: {
      50: "#00ADB5",
    },
    darkGray: {
      50: "#111827",
    },
    lightGray: {
      50: "#6B7280",
    },
    white: {
      50: "#fff",
    },
    black: {
      50: "#000",
    },
    success: {
      50: "#22C55E",
    },
    fail: {
      50: "#EF4444",
    },
  },
  config: {
    initialColorMode: "dark",
  },
});

export default theme;
