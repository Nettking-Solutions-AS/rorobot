import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { Heading } from "native-base";

/**
 * Dashboard component that displays a greeting to the user
 * @returns {JSX.Element} - rendered component
 */
export default function Dashboard() {
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
