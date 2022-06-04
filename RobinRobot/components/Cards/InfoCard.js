/* eslint-disable no-unneeded-ternary */
import React from "react";

// styled components
import styled from "styled-components/native";
import { ScreenHeight } from "../shared";
import { colors } from "../colors";
import RegularText from "../Texts/RegularText";
import SmallText from "../Texts/SmallText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const { primary, secondary, black, accent } = colors;

const CardView = styled.View`
  flex-direction: row;
  height: ${ScreenHeight * 0.2}px;
  background-color: ${primary};
  border-width: 2px;
  border-color: ${secondary};
  padding: 20px;
  border-radius: 15px;
  overflow: hidden;
  elevation: 5;
  shadow-color: ${black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
`;

const CardSection = styled.View`
  justify-content: space-between;
  align-items: flex-start;
`;

const InfoCard = ({ icon, title, value, date, color, ...props }) => {
  return (
    <CardView style={{ ...props?.style }}>
      <CardSection style={{ width: "60%" }}>
        <RegularText style={{ fontWeight: "bold" }}>{title}</RegularText>
        <RegularText style={{ fontWeight: "bold", fontSize: 25 }}>
          kr {value}
        </RegularText>
        <SmallText>{date}</SmallText>
      </CardSection>
      <CardSection style={{ width: "40%" }}>
        <MaterialCommunityIcons
          name={icon}
          size={ScreenHeight * 0.13}
          color={color ? color : accent}
        />
      </CardSection>
    </CardView>
  );
};

export default InfoCard;
