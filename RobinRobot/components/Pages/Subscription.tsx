//@ts-nocheck
import React, { useEffect, useState } from "react";

import { colors } from "../../components/colors";
import config from "../../config";
import { Text } from "react-native";
import {
  FormControl,
  Input,
  Select,
  CheckIcon,
  WarningOutlineIcon,
} from "native-base";
import { Image, Linking, View, Modal, ScrollView } from "react-native";
import { Error } from "../../lib/Types.d";
import {
  validateAPIKey,
  validateName,
  validateAPISecret,
  validateExchange,
} from "../../lib/Validation";
import DCABot from "./DCABot";
// styled components
import ConnectButton from "../Buttons/Connect";
const { primary, secondary, black } = colors;
import { db, auth } from "../../firebase/Config";
import { Alert } from "react-native";
// custom components
import MainContainer from "../../components/Containers/MainContainer";
import BigText from "../../components/Texts/BigText";
import PressableText from "../Texts/PressableText";

// styled components
import styled from "styled-components/native";
import { ScreenHeight } from "../../components/shared";
const { darkGray } = colors;

import { NavigationProp } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const TopBg = styled.View`
  background-color: ${darkGray};
  width: 100%;
  height: ${ScreenHeight * 0.3}px;
  border-radius: 30px;
  position: absolute;
  top: -30px;
`;

const CardView = styled.View`
  flex-direction: row;
  height: ${ScreenHeight * 0.7}px;
  background-color: ${primary};
  border-width: 2px;
  border-color: ${secondary};
  padding: 20px;
  align-self: center;
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

const Subscription = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [exchange, setExchange] = React.useState("");
  const [APIKey, setAPIKey] = React.useState("");
  const [APISecret, setAPISecret] = React.useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);
  const [stateReload, setStateReload] = useState(0)
  const [isSet, setIsSet] = useState(false);
  const [addNewModal, setAddNewModal] = useState(false);
  const [userDoc, setUserDoc] = useState([])
  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  const onExchangePress = async () => {
    // TODO: FILL DB
    setAddNewModal(false)
    const validationErrors = [
      ...validateExchange(exchange),
      ...validateName(name),
      ...validateAPIKey(APIKey),
      ...validateAPISecret(APISecret),  
    ];
    var reference = Math.floor(Math.random() * 999999990);
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      var existing = userDoc;
      existing.push({
        Exchange: exchange, 
        userID: auth.currentUser.uid,
        ExchangeName: name,
        APIKey: APIKey,
        APISecret: APISecret,
      });
      db.collection(`connects`).doc(`${reference}`).set(
        {
          Exchange: exchange,
          userID: auth.currentUser.uid,
          ExchangeName: name,
          APIKey: APIKey,
          APISecret: APISecret,
        }
      );
      
    }
  };

  return (
    <MainContainer style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
      <TopBg />
        <Text style={{color: "#fff", fontSize: 30, marginVertical: 30, alignSelf: "center"}}>
            Coming Soon
        </Text>
      
    </MainContainer>
  );
};

export default Subscription;
