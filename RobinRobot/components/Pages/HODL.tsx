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
import { Alert } from "react-native";
import { ActivityIndicator, Image, Linking, View } from "react-native";
import { Error } from "../../lib/Types.d";
import {
  validateAPIKey,
  validateName,
  validateAPISecret,
  validateExchange,
} from "../../lib/Validation";
import DateTimePicker from '@react-native-community/datetimepicker';
// styled components
import ConnectButton from "../Buttons/Connect";
const { primary, secondary, black } = colors;
import { db, auth } from "../../firebase/Config";

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
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
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

const HODLBot = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [exchange, setExchange] = React.useState("");
  const [exchanges, setExchanges] = React.useState("");
  const [APIKey, setAPIKey] = React.useState("");
  const [APISecret, setAPISecret] = React.useState("");
  const [name, setName] = useState("");
  const [time, setTime] = useState("00:00");
  const [hodls, setHodls] = useState([]);
  const [amount, setAmount] = useState(0);
  const [dcas, setDcas] = useState([]);
  const [activateBtn, setActivateBtn] = useState("Activate Bot")
  const [errors, setErrors] = useState<Error[]>([]);
  const [isSet, setIsSet] = useState(false);
  const [stableCoin, setStableCoin] = useState("");
  const [risk, setRisk] = useState("");
  const [assets, setAssets] = useState([]);
  const [free, setFree] = useState(0);
  const [convertedFree, setConvertedFree] = useState(0);
  const [userDoc, setUserDoc] = useState([])
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
    setShow(true)
  };

  const showTimepicker = () => {
    showMode('time');
  };
  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

    const getDCAs = () => {
      fetch(`${config.serverURL}/hodls`)
      .then(response => response.json())
      .then(data => {
        console.log( "HODL", data);
        setDcas(data)
      })
    }
 
  const onExchangePress = async () => {
    // TODO: FILL DB
    setActivateBtn(<ActivityIndicator size="large" />);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "userID": auth.currentUser.uid,
      "amount": amount,
      "stableCoin": stableCoin,
      "time": time,
      "date": date,
      "keys": JSON.parse(exchange),
      "asset": exchanges,
      "status": "pending"
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch(`${config.serverURL}/create_hodl`, requestOptions)
    .then(response => response.json())
    .then(data => {
      // console.log(data.message);
      // Alert.alert("Info", data.message);
      getDCAs();
      setNewDCA(false)
    })
  };



  const setAmountPercentage = (percent) => {
    setAmount(((parseInt(percent) / 100) * parseFloat(free)).toFixed(8));
  }


  useEffect(() => {
    getDCAs();  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "userID": auth.currentUser.uid,
      "apiKey": APIKey,
      "apiSecret": APISecret
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
          setIsSet(true);
          setUserDoc(result);
          fetch(`${config.serverURL}/getBalance`, {
            
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "userID": auth.currentUser.uid,
                "apiKey": result[0].APIKey,
                "apiSecret": result[0].APISecret
              }),
              redirect: 'follow'
            
          })
          .then(response => response.json())
          .then(result => {
            setAssets(result.balances);
            
          })
          .catch(error => {

          });
      })
      .catch(error => {

      });

      
  }, [])
  return (
    
        <ScrollView>

            {
              dcas.length <= 0 ?
              <>
                <BigText style={{ marginBottom: 25, fontWeight: "bold" }}>
                HODL Bot
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

                        {
                          userDoc.map((obj, index) => {
                            if(obj.userID !== auth.currentUser.uid){
                              return null
                            }
                            return(
                              <Select.Item key={index} label={obj.ExchangeName + ` (${obj.Exchange})`} value={JSON.stringify({apiKey: obj.APIKey, secKey: obj.APISecret})} />
                            )
                          })
                        }
                    </Select>

                    <Select
                        selectedValue={exchanges}
                        minWidth="330"
                        accessibilityLabel="Choose Asset"
                        placeholder="Choose Cryptocurrency"
                        height={12}
                        mt={10}
                        mb={5}
                        fontSize={15}
                        borderRadius={10}
                        color="#fff"
                        _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />,
                        }}
                        onValueChange={(itemValue) => {
                          setConvertedFree(<ActivityIndicator size="small" />)
                            setExchanges(itemValue);
                            const amount = assets.find(x => x.asset === itemValue).free;
                            setFree(amount);
                            fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${itemValue}USDT`)
                            .then(res => res.json())
                            .then(result => {
                              const exPrice = parseFloat(result.price);
                              setConvertedFree((amount * exPrice).toFixed(4));
                            })
                          }
                        }
                    >
                      {
                        assets.map((obj, index) => {
                          return(
                            <Select.Item key={index} label={`${obj.asset} (${obj.free})`} value={obj.asset} />
                          )
                        })
                      }
                        
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
                    <FormControl.Label mt={0}>
                        <Text bold style={{ color: "#fff" }}>
                        Amount
                        </Text>
                    </FormControl.Label>
                      <Text style={{color: "#fff"}}>Balance (in USDT)</Text><BigText>{convertedFree} USDT</BigText>
                    <Input
                        minWidth="330px"
                        placeholder="Amount to Trade"
                        height={12}
                        keyboardType="numeric"
                        value={amount}
                        fontSize={15}
                        borderRadius={10}
                        color="#fff"
                        onChangeText={(text) => seAmount(text)}
                    />
                    <View style={{flexDirection: "row", width: 330, justifyContent: "space-between"}}>
                      <View style={{width: "19%", justifyContent: "center"}}>
                        <ConnectButton onPress={() => {
                          return setAmountPercentage(20);
                        }}>20%</ConnectButton>
                      </View>
                      <View style={{width: "19%", justifyContent: "center"}}>
                        <ConnectButton  onPress={() => {
                          return setAmountPercentage(40);
                        }}>40%</ConnectButton>
                      </View>
                      <View style={{width: "19%", justifyContent: "center"}}>
                        <ConnectButton  onPress={() => {
                          return setAmountPercentage(60);
                        }}>60%</ConnectButton>
                      </View>
                      <View style={{width: "19%", justifyContent: "center"}}>
                        <ConnectButton  onPress={() => {
                          return setAmountPercentage(80);
                        }}>80%</ConnectButton>
                      </View>
                      <View style={{width: "19%", justifyContent: "center"}}>
                        <ConnectButton  onPress={() => {
                          return setAmountPercentage(100);
                        }}>100%</ConnectButton>
                      </View>
                    </View>
                    <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                        {getErrorsByType("name").map((e) => e.message)}
                    </FormControl.ErrorMessage>
                    </FormControl>
                    

                    <Select
                        selectedValue={stableCoin}
                        minWidth="330"
                        accessibilityLabel="Select Stable coin to trade"
                        placeholder="Select Stable coin to trade"
                        height={12}
                        fontSize={15}
                        mb={5}
                        borderRadius={10}
                        color="#fff"
                        _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />,
                        }}
                        onValueChange={(itemValue) => setStableCoin(itemValue)}
                    >
                        <Select.Item label="USDT" value="USDT" />
                        <Select.Item label="BUSD" value="BUSD" />
                    </Select>

                    <Select
                        selectedValue={time}
                        minWidth="330"
                        accessibilityLabel="Select trade time"
                        placeholder="Select trade time"
                        height={12}
                        fontSize={15}
                        mb={5}
                        borderRadius={10}
                        color="#fff"
                        _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />,
                        }}
                        onValueChange={(itemValue) => setTime(itemValue)}
                    >
                        <Select.Item label="00:00" value="00:00" />
                        <Select.Item label="01:00" value="01:00" />
                        <Select.Item label="02:00" value="02:00" />
                        <Select.Item label="03:00" value="03:00" />
                        <Select.Item label="04:00" value="04:00" />
                        <Select.Item label="05:00" value="05:00" />
                        <Select.Item label="06:00" value="06:00" />
                        <Select.Item label="07:00" value="07:00" />
                        <Select.Item label="08:00" value="08:00" />
                        <Select.Item label="09:00" value="09:00" />
                        <Select.Item label="10:00" value="10:00" />
                        <Select.Item label="11:00" value="11:00" />
                        <Select.Item label="12:00" value="12:00" />
                        <Select.Item label="13:00" value="13:00" />
                        <Select.Item label="14:00" value="14:00" />
                        <Select.Item label="15:00" value="15:00" />
                        <Select.Item label="16:00" value="16:00" />
                        <Select.Item label="17:00" value="17:00" />
                        <Select.Item label="18:00" value="18:00" />
                        <Select.Item label="19:00" value="19:00" />
                        <Select.Item label="20:00" value="20:00" />
                        <Select.Item label="21:00" value="21:00" />
                        <Select.Item label="22:00" value="22:00" />
                        <Select.Item label="23:00" value="23:00" />
                    </Select>
                    
                    <ConnectButton onPress={showDatepicker}>Select Start Date {date > new Date() ? "(Selected)" : ""}</ConnectButton>
                    {show && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                        />
                    )}

                    
                    <ConnectButton onPress={onExchangePress}>{activateBtn}</ConnectButton>
                </CardSection>
                </CardView>
              </>
              :
              <>
                <View style={{flexDirection: "row", width: "95%", padding: 10, marginVertical: 10, borderWidth: 0.2, borderColor: "#c4c5c6", borderRadius: 10, marginTop: 35}}>
                  <View style={{width: "60%", justifyContent: "center"}}>
                    <BigText style={{fontWeight: "bold"}}>
                      Active Bots
                    </BigText>
                  </View>
                  <View style={{width: "40%", justifyContent: "center"}}>
                    <TouchableOpacity onPress={() => {
                      setNewDCA(true)
                    }}>
                      <View style={{backgroundColor: "green", padding: 10, borderRadius: 5}}>
                        <Text style={{color: "#fff", fontWeight: "bold", alignSelf: "center"}}>
                          Create New Bot
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              {
                dcas.map((obj, index) => {
                  if(obj.body.userID !== auth.currentUser.uid){
                    return null
                  }
                  return(
                    <View style={{flexDirection: "row", width: "95%", padding: 10, marginVertical: 10, borderWidth: 0.2, borderColor: "#c4c5c6", borderRadius: 10}}>
                      <View style={{width: "75%", justifyContent: "center"}}>
                        <Text style={{color: "#fff", fontWeight: "bold"}}>
                          Robot {index + 1}
                        </Text>
                        <Text style={{color: "#fff", fontWeight: "bold"}}>
                          Amount: {obj.body.amount} {obj.body.asset}
                        </Text>
                        <Text style={{color: "#fff", fontWeight: "bold"}}>
                          Asset: {obj.body.asset}
                        </Text>
                        <Text style={{color: "#fff", fontWeight: "bold"}}>
                          Date: {obj.body.date}
                        </Text>
                        <Text style={{color: "#fff", fontWeight: "bold"}}>
                          Time: {obj.body.time}
                        </Text>
                      </View>
                      <View style={{width: "25%", justifyContent: "center"}}>
                      <Text style={{color: "#fff", fontWeight: "bold", marginVertical: 10, alignSelf: "center"}}>
                            <Text>Coin: </Text>
                            {obj.body.stableCoin}
                          </Text>
                        <View style={{backgroundColor: obj.body.status === "pending" ? "orange" : "green", padding: 10, borderRadius: 5}}>
                         
                          <Text style={{color: "#fff", fontWeight: "bold", alignSelf: "center"}}>
                            {obj.body.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )
                })
              }
              </>
            }
        </ScrollView>
  );
};

export default HODLBot;
