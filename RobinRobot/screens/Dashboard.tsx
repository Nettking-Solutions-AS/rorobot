import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { useGlobalState } from "../components/StateManagement/GlobalState";
import { StyleSheet, SafeAreaView } from "react-native";
import { Heading } from "native-base";

export default function Dashboard({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const { state } = useGlobalState();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      width: "100%",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Heading>Hallo, Aleksander!</Heading>
    </SafeAreaView>
  );
}
