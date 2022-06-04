import React, { useState } from "react";

import { colors } from "../../components/colors";

import {
  FormControl,
  Box,
  Text,
  Input,
  Select,
  CheckIcon,
  WarningOutlineIcon,
} from "native-base";
import { Linking } from "react-native";
import { Error } from "../../lib/Types.d";
import {
  validateAPIKey,
  validateName,
  validateAPISecret,
  validateExchange,
} from "../../lib/Validation";

// styled components
import CreateAccount from "../Texts/CreateAccount";
import ConnectButton from "../Buttons/Connect";
const { primary, secondary, black } = colors;
import { db, auth } from "../../firebase/Config";

// custom components
import MainContainer from "../../components/Containers/MainContainer";
import BigText from "../../components/Texts/BigText";

// styled components
import styled from "styled-components/native";
import { ScreenHeight } from "../../components/shared";
const { darkGray } = colors;

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
  height: ${ScreenHeight * 0.5}px;
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

const ConnectExchange = ({ navigation, ...props }: { navigation: any }) => {
  const [exchange, setExchange] = React.useState("");
  const [APIKey, setAPIKey] = React.useState("");
  const [APISecret, setAPISecret] = React.useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);

  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  const onExchangePress = async () => {
    // TODO: FILL DB
    const validationErrors = [
      ...validateExchange(exchange),
      ...validateName(name),
      ...validateAPIKey(APIKey),
      ...validateAPISecret(APISecret),
    ];

    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      const docRef = db.collection("users").doc(auth.currentUser?.uid);
      const res = await docRef.set(
        {
          Exchange: exchange,
          ExchangeName: name,
          APIKey: APIKey,
          APISecret: APISecret,
        },
        { merge: true }
      );
      navigation.navigate("Dashboard");
    }
  };

  return (
    <MainContainer style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
      <TopBg />
      <MainContainer style={{ backgroundColor: "transparent" }}>
        <BigText style={{ marginBottom: 25, fontWeight: "bold" }}>
          Connect new exchange
        </BigText>
        <CardView>
          <CardSection style={{ width: "60%" }}>
            <FormControl w="3/4" maxW="330" isRequired>
              <FormControl.Label>
                <Text bold>Velg børs</Text>
              </FormControl.Label>

              <Select
                selectedValue={exchange}
                minWidth="330"
                accessibilityLabel="Choose exchange"
                placeholder="Choose exchange"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={(itemValue) => setExchange(itemValue)}
              >
                <Select.Item label="Binance" value="Binance" />
                <Select.Item label="Coinbase" value="Coinbase" />
              </Select>

              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {getErrorsByType("exchange").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl
              w="3/4"
              maxW="330"
              isRequired
              isInvalid={getErrorsByType("name").length > 0}
            >
              <FormControl.Label>
                <Text bold>Name</Text>
              </FormControl.Label>

              <Input
                minWidth="330px"
                placeholder={exchange}
                onChangeText={(text: string) => setName(text)}
              />

              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {getErrorsByType("name").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl>
              <FormControl.Label>
                <Text bold>API key</Text>
              </FormControl.Label>

              <Input
                minWidth="330px"
                onChangeText={(text: string) => setAPIKey(text)}
              />

              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {getErrorsByType("APIKey").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl>
              <FormControl.Label>
                <Text bold>API secret</Text>
              </FormControl.Label>

              <Input
                minWidth="330px"
                onChangeText={(text: string) => setAPISecret(text)}
              />

              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {getErrorsByType("APISecret").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>

            <ConnectButton onPress={onExchangePress}>Connect</ConnectButton>

            <Box mt="25px">
              <Text minWidth="330px">
                Don't have an account?
                <CreateAccount
                  onPress={() => {
                    Linking.openURL("https://binance.com");
                  }}
                >
                  {" "}
                  Create an account with Binance
                </CreateAccount>
              </Text>
            </Box>
          </CardSection>
        </CardView>
      </MainContainer>
    </MainContainer>
  );
};

export default ConnectExchange;
