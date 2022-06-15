import "react-native-gesture-handler";
import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import GlobalStateProvider from "./components/StateManagement/GlobalState";
import ScreenManager from "./navigators/ScreenManager";

export default function App() {
  return (
    <GlobalStateProvider>
      <NativeBaseProvider>
        <ScreenManager />
      </NativeBaseProvider>
    </GlobalStateProvider>
  );
}
