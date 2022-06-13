import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { useGlobalState } from "../components/StateManagement/GlobalState";
import { StyleSheet, SafeAreaView } from "react-native";
import { Heading } from "native-base";

import { colors } from "../components/colors";

// custom components
import MainContainer from "../components/Containers/MainContainer";
import BigText from "../components/Texts/BigText";
import InfoCard from "../components/Cards/InfoCard";

// styled components
import styled from "styled-components/native";
import { ScreenHeight } from "../components/shared";
const { darkGray } = colors;

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
