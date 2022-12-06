import React from "react";

// styled components
import styled from "styled-components/native";
import { colors } from "../colors";
const { primary } = colors;

const StyledView = styled.ScrollView`
  padding: 25px;
  padding-top: 25px;
  background-color: ${primary};
`;

const MainContainer = (props) => {
  return <StyledView {...props}>{props.children}</StyledView>;
};

export default MainContainer;
