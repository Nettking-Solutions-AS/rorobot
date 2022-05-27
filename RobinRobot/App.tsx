import "react-native-gesture-handler";
import React from "react";
import { NativeBaseProvider } from "native-base";
import theme from './components/theme'
import GlobalStateProvider from "./components/StateManagement/GlobalState";
import RootStack from './navigators/RootStack'

export default function App() {
  return (
    <GlobalStateProvider>
      <NativeBaseProvider theme={theme}>
        <RootStack />
      </NativeBaseProvider>
    </GlobalStateProvider>
  );
}
