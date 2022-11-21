//@ts-nocheck
import React from "react";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Heading } from "native-base";

export default function Dashboard() {
  

  return (
    <>
      <ScrollView>
        <Heading>Hallo, Aleksander!</Heading>
      </ScrollView>
    </>
    
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
});