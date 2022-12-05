//@ts-nocheck
import React, { useEffect, useState } from "react";

import { colors } from "../../components/colors";
import config from "../../config";
import {
  FormControl,
  Text,
  Input,
  Select,
  CheckIcon,
  WarningOutlineIcon,
} from "native-base";
import { Image, Linking, View } from "react-native";
import { Error } from "../../lib/Types.d";
import {
  validateAPIKey,
  validateName,
  validateAPISecret,
  validateExchange,
} from "../../lib/Validation";
import HODLBot from "./HODL";
// styled components
import ConnectButton from "../Buttons/Connect";
const { primary, secondary, black } = colors;
import { db, auth } from "../../firebase/Config";
import { ScrollView } from "react-native";
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

const HODL = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [exchange, setExchange] = React.useState("");
  const [APIKey, setAPIKey] = React.useState("");
  const [APISecret, setAPISecret] = React.useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);
  const [isSet, setIsSet] = useState(false);
  const [userDoc, setUserDoc] = useState([])
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
      const docRef = db.collection(`users`).doc(auth.currentUser?.uid);
      await docRef.set(
        {
          Exchange: exchange,
          userID: auth.currentUser.uid,
          ExchangeName: name,
          APIKey: APIKey,
          APISecret: APISecret,
        },
        { merge: true }
      );
      navigation.navigate("Dashboard");
    }
  };

useEffect(() => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "userID": auth.currentUser.uid
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders, 
    body: raw,
    redirect: 'follow'
  };
  
  fetch(`${config.serverURL}/getUserConfig`, requestOptions)
    .then(response => response.json())
    .then(result => {
        // alert(JSON.stringify(result))
        setUserDoc(result);
    })
    .catch(error => {

    });
  }, [])
  return (
    <MainContainer style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
      <TopBg />
      <MainContainer style={{ backgroundColor: "transparent" }}>
        {
          userDoc.length == 0 ? 
            <>
              <BigText style={{ marginBottom: 25, fontWeight: "bold" }}>
                Connect new exchange
              </BigText>
              <CardView>
                <CardSection>
                  <FormControl isRequired>
                    <FormControl.Label>
                      <Text bold style={{ color: "#fff" }}>
                        Choose exchange
                      </Text>
                    </FormControl.Label>

                    <Select
                      selectedValue={exchange}
                      minWidth="330"
                      accessibilityLabel="Choose exchange"
                      placeholder="Choose exchange"
                      height={12}
                      fontSize={15}
                      borderRadius={10}
                      color="#fff"
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
                    isRequired
                    isInvalid={getErrorsByType("name").length > 0}
                  >
                    <FormControl.Label mt={25}>
                      <Text bold style={{ color: "#fff" }}>
                        Name
                      </Text>
                    </FormControl.Label>

                    <Input
                      minWidth="330px"
                      placeholder={exchange}
                      height={12}
                      fontSize={15}
                      borderRadius={10}
                      color="#fff"
                      onChangeText={(text: string) => setName(text)}
                    />

                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {getErrorsByType("name").map((e) => e.message)}
                    </FormControl.ErrorMessage>
                  </FormControl>

                  <FormControl
                    isRequired
                    isInvalid={getErrorsByType("APIKey").length > 0}
                  >
                    <FormControl.Label mt={25}>
                      <Text bold style={{ color: "#fff" }}>
                        API key
                      </Text>
                    </FormControl.Label>

                    <Input
                      minWidth="330px"
                      height={12}
                      fontSize={15}
                      borderRadius={10}
                      color="#fff"
                      onChangeText={(text: string) => setAPIKey(text)}
                    />

                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {getErrorsByType("APIKey").map((e) => e.message)}
                    </FormControl.ErrorMessage>
                  </FormControl>

                  <FormControl
                    isRequired
                    isInvalid={getErrorsByType("APISecret").length > 0}
                  >
                    <FormControl.Label mt={25}>
                      <Text bold style={{ color: "#fff" }}>
                        API secret
                      </Text>
                    </FormControl.Label>

                    <Input
                      minWidth="330px"
                      height={12}
                      fontSize={15}
                      borderRadius={10}
                      color="#fff"
                      onChangeText={(text: string) => setAPISecret(text)}
                    />

                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {getErrorsByType("APISecret").map((e) => e.message)}
                    </FormControl.ErrorMessage>
                  </FormControl>

                  <ConnectButton onPress={onExchangePress}>Connect</ConnectButton>

                  <Text alignSelf="center" color="#fff">
                    Don't have an account with Binance?
                  </Text>
                  <PressableText
                    onPress={() => {
                      Linking.openURL("https://binance.com");
                    }}
                  >
                    Create an account with Binance
                  </PressableText>
                </CardSection>
              </CardView>
            </>
          :
          <>
            <BigText style={{ marginBottom: 25, fontWeight: "bold" }}>
              Active Account
            </BigText>
            <ScrollView horizontal={true}>
            {
              userDoc.map((obj, index) => {
                if(obj.userID !== auth.currentUser.uid){
                  return null
                }
                return(
                <View key={index} style={{flexDirection: "row", width: 330, borderRadius: 20, marginVertical: 10, marginHorizontal: 10, alignSelf: "center", padding: 20, borderWidth: 1, borderColor: "#c4c5c650"}}>
                  <View style={{width: "20%", justifyContent: "center"}}>
                    <Image style={{height: 40, width: 40}} source={{uri: obj.Exchange === "Binance" ? "https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png" : ""}} />
                  </View>
                  <View style={{width: "60%", justifyContent: "center"}}>
                    <Text style={{color: "#fff", fontSize: 16, fontWeight: "900"}}>{obj.ExchangeName}</Text>
                    <Text style={{color: "#fff", fontSize: 12, fontWeight: "900"}}>API Key: {obj.APIKey}</Text>
                  </View>
                  <View style={{width: "20%", justifyContent: "center"}}>
                    <TouchableOpacity>
                      <MaterialCommunityIcons name="close" style={{alignSelf: "flex-end"}} size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
                );
              })
            }
            </ScrollView>
            <HODLBot />
          </>
        }
        <View style={{height: 70}} />
       
      </MainContainer>
      
    </MainContainer>
  );
};

export default HODL;
