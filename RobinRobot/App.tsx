import "react-native-gesture-handler";
import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import GlobalStateProvider from "./components/StateManagement/GlobalState";
import RootStack from './navigators/RootStack'

export default function App() {
  const theme = extendTheme({
    colors: {
      // Farger
      primary: {
        50: "#1ed760", // Lys grønn
        100: "#aaa", // Lys grå
        150: "#121212", // Svart
        200: "#fff", // Hvit
        250: "#e22134", // Rød
        300: "#2e77d0", // Blå
        green: "#16a34a",
      },
    },
  });

  return (
    <GlobalStateProvider>
      <NativeBaseProvider theme={theme}>
        <RootStack />
      </NativeBaseProvider>
    </GlobalStateProvider>
  );
}
