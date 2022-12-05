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

const ConnectExchange = ({
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
        console.log("Account", result);
          var empty = [];
          empty.push(result);
          setIsSet(true);
          setUserDoc(result);
      })
      .catch(error => {
        setIsSet(false);
      });
  }, [])
  return (
    <MainContainer style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
      <TopBg />
      <Modal
        visible={addNewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setAddNewModal(false)
        }}
      >
      <ScrollView style={{backgroundColor: "#000", width: "100%", alignSelf: "center"}}>
              <BigText style={{ marginBottom: 25, marginVertical: 30, alignSelf: "center", fontWeight: "bold" }}>
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
                      style={{alignSelf: "center"}}
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
                  <ConnectButton onPress={() => {setAddNewModal(false)}}>Cancel</ConnectButton>
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
      </ScrollView>
      </Modal>
      <MainContainer style={{ backgroundColor: "transparent", }}>
        {
          userDoc.length <= 0 ? 
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
              Active Account(s)
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
                    <TouchableOpacity onPress={() => {
                      db.collection("connects").where("APIKey", "==", obj.APIKey)
                      .get()
                      .then((querySnapshot) => {
                        querySnapshot.forEach(doc=>{
                          doc.ref.delete()
                        })
                        Alert.alert("Success", "Deletec Successfully")
                      })
                    }}>
                      <MaterialCommunityIcons name="close" style={{alignSelf: "flex-end"}} size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
                );
              })
            }
            </ScrollView>
            <TouchableOpacity onPress={() => {
              setAddNewModal(true);
            }} style={{alignSelf: "center", padding: 10, borderRadius: 30, borderWidth: 0.2, borderColor: "#f0f0f0", marginVertical: 15}}>
              <Text style={{color: "#fff", fontSize: 16, fontWeight: "bold"}}>Connect Another Account</Text>
            </TouchableOpacity>
            <DCABot />
          </>
        }
        <View style={{height: 70}} />
        
      </MainContainer>
      
    </MainContainer>
  );
};

export default ConnectExchange;
