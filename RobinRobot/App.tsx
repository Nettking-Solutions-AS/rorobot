import "react-native-gesture-handler";
import React from "react";
import { NativeBaseProvider } from "native-base";
import GlobalStateProvider from "./components/StateManagement/GlobalState";
import ScreenManager from "./navigators/ScreenManager";

/**
 * The main entry point for the application.
 * Wraps the application with the GlobalStateProvider and NativeBaseProvider.
 * @returns {JSX.Element} The JSX Element to render
 */
export default function App() {
  return (
    <GlobalStateProvider>
      <NativeBaseProvider>
        <ScreenManager />
      </NativeBaseProvider>
    </GlobalStateProvider>
  );
}
