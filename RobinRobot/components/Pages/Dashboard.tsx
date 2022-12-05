//@ts-nocheck
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator, Image, AsyncStorage, Alert } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { Octicons } from "@expo/vector-icons";
import { Text, HStack, Center, Box } from "native-base";
import { useGlobalState } from "../StateManagement/GlobalState";
import { Coin, Stat } from "../../lib/Types";
import { db, auth } from "../../firebase/Config";
import BigText from "../../components/Texts/BigText";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import config from "../../config";
interface CoinWithAmount extends Coin {
  amount: string;
}

interface Data {
  result: Coin[];
}

export default function Dashboard() {
  const { state } = useGlobalState();
  const [coins, setCoins] = useState<CoinWithAmount[]>([]);
  const [loadingCoins, setLoading] = useState(false);
  const [loading, setLoadings] = useState(false);
  const [renderStats, setRenderStat] = useState([]);
  const [isSet, setIsSet] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState("");
  const [currentApiSecret, setCurrentApiSecret] = useState("");
  const [dcas, setDcas] = useState([]);
  const [dailyStat, setDailyStat] = useState([]);
  const [userDoc, setUserDoc] = useState([])
  const [sortType, setSortType] = useState<"ascending" | "descending">(
    "ascending"
  );
  console.log(state.currentUser.id)
  const [sortIconChange, setsortIconChange] = useState<
    "sort-asc" | "sort-desc" | "unfold"
  >("unfold");
  const [dailyStats, setDailyStats] = useState<Stat[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  const amount = () => (
    <HStack space={1}>
      <Center mb="3" mr="2">
        <Text bold style={styles.headerTextSecondItem}>
          Amount
        </Text>
      </Center>
      <Center>
        <Octicons
          name={sortIconChange}
          size={22}
          style={styles.sortIcon}
          onPress={() => combinedOnPress()}
        />
      </Center>
    </HStack>
  );

  const token = () => (
    <HStack space={1}>
      <Center mb="3" mr="2">
        <Text bold style={styles.headerTextFirstItem}>
          Token
        </Text>
      </Center>
      <Center>
        <Octicons name="unfold" size={22} style={styles.sortIcon} />
      </Center>
    </HStack>
  );

  const price = () => (
    <HStack space={1}>
      <Center mb="3" mr="2">
        <Text bold style={styles.headerTextThirdItem}>
          Price
        </Text>
      </Center>
      <Center>
        <Octicons name="unfold" size={22} style={styles.sortIcon} />
      </Center>
    </HStack>
  );

  const combinedOnPress = () => {
    setSortType(sortType === "ascending" ? "descending" : "ascending");
    setsortIconChange(sortIconChange === "sort-asc" ? "sort-desc" : "sort-asc");
  };

  const fetchDailyStats = useCallback(async () => {
    setLoadingStats(true);

    const { data: fetchedStats } = await axios.post<{ result: Stat[] }>(
      `${config.serverURL}/getDailyStats`,
      { 
        apiKey: state.currentUser.APIKey,
        apiSecret: state.currentUser.APISecret
      }
    );
    setDailyStats(fetchedStats.result);
    setLoadingStats(false);
  }, []);

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    const uri = `${config.serverURL}/getCapitalConfigs`;
    const { data: response } = await axios.post<Data>(uri, {
      apiKey: state.currentUser.APIKey,
      apiSecret: state.currentUser.APISecret
    });

    let entries = response.result
      .filter((entity) => entity.free > 0 || entity.locked > 0)
      .map((entry) => ({
        ...entry,
        amount: ((entry.free * 10 + entry.locked * 10) / 10).toFixed(8),
      }));

    entries = entries.sort((a, b) => (a.amount > b.amount ? 1 : -1));

    setCoins(entries);
    setLoading(false);
  }, []);

  useEffect(() => {
    setCoins(
      coins.sort((a, b) =>
        (sortType === "ascending" ? a : b).amount >
        (sortType === "ascending" ? b : a).amount
          ? 1
          : -1
      )
    );
  }, [sortType, coins]);
  const getList = (key_, sec_) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "apiKey": key_,
      "apiSecret": sec_
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };




    

    fetch(`${config.serverURL}/getDailyStats`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setDailyStat(result.result);
        AsyncStorage.setItem("dailyStat", JSON.stringify(result.result))
        setDailyStats(result.result);
        console.log("STATS", JSON.stringify(result))
        fetch(`${config.serverURL}/getBalance`, {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({
            "apiKey": key_,
            "apiSecret": sec_
          }),
          redirect: 'follow'
        })
        .then(response => response.json())
        .then(result => {
          var balances = result.balances;
          console.log("_Balances_", result)
          setLoadings(null)
          setRenderStat(balances);
          AsyncStorage.setItem("balances", JSON.stringify(balances))
          // setDailyStats(result.result);
          // console.log(JSON.stringify(result))
        })
        .catch(error => console.log('errorLog', error));
        })
      .catch(error => console.log('errorLogs', error));
  }
  useEffect(() => {
    fetch(`${config.serverURL}/dcas`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // alert(JSON.stringify(data))
      setDcas(data)
    })
    AsyncStorage.getItem("dailyState").then((dStat) => {
      if(dStat !== null && dStat !== undefined){
        setDailyStat(JSON.parse(dStat));
        AsyncStorage.getItem("balances").then(bals => {
          setRenderStat(JSON.parse(bals));
        })
      }
    })
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "apiKey": currentApiKey,
      "apiSecret": currentApiSecret
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    (async () => {
      await fetchCoins();
      await fetchDailyStats();
    })();




    

    fetch(`${config.serverURL}/getDailyStats`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setDailyStat(result.result);
        AsyncStorage.setItem("dailyStat", JSON.stringify(result.result))
        // setDailyStats(result.result);
        console.log(JSON.stringify(result))
        fetch(`${config.serverURL}/getBalance`, {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({
            "apiKey": state.currentUser.APIKey,
            "apiSecret": state.currentUser.APISecret
          }),
          redirect: 'follow'
        })
        .then(response => response.json())
        .then(result => {
          var balances = result.balances;
          // console.log("_Balances_", balances)
          setRenderStat(balances);
          AsyncStorage.setItem("balances", JSON.stringify(balances))
          // setDailyStats(result.result);
          // console.log(JSON.stringify(result))
        })
        .catch(error => console.log('error', error));
        })
      .catch(error => console.log('error', error));
 
    




    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "userID": state.currentUser.id
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${config.serverURL}/getUserConfig`, requestOptions)
      .then(response => response.json())
      .then(result => {setIsSet(true);
          setUserDoc(result);
      })
      .catch(error => {

      });
  }, []);

  return (
    <ScrollView
      style={styles.background}
      contentContainerStyle={styles.container}
    >
      {/* <Box style={styles.containerBackground}>
        {loadingCoins || loadingStats ? (
          <ActivityIndicator size="large" />
        ) : (
          <Table>
            <Row
              data={[token(), amount(), price()]}
              style={styles.tableHeader}
              textStyle={[styles.headerText]}
            />
            <Rows
              data={coins.map((coin) => {
                const foundStat = dailyStats.find((stat) =>
                  [coin.coin + "USDT", coin.coin + "ETH"].includes(stat.symbol)
                );

                return [
                  coin.name + "\n" + coin.coin,
                  ((coin.free * 10 + coin.locked * 10) / 10).toFixed(8),
                  "$" + Number(foundStat?.lastPrice).toFixed(4),
                ];
              })}
              textStyle={[styles.entry]}
            />
          </Table>
        )}
        
        </Box> */}
        
        <Box style={styles.containerBackground}>
          {/* <ScrollView horizontal={true} style={{flexDirection: "row", flexWrap: "nowrap"}}>
          { 
              dcas.map((obj, index) => {
                if(obj.body.userID !== auth.currentUser.uid){
                  return null
                }
                return(
                  <View style={{flexDirection: "row", width: 300, padding: 10, marginVertical: 10, borderWidth: 0.2, justifyContent: "space-between", marginRight: 10, borderColor: "#c4c5c6", borderRadius: 10}}>
                    <TouchableOpacity style={{width: "100%", justifyContent: "center",}}>
                      <View style={{flexDirection: "row"}}>
                      <View style={{width: "70%"}}>
                        <Text style={{color: "#fff", fontWeight: "bold"}}>
                          API Key - {index + 1}
                        </Text>
                        <Text style={{color: "#fff", fontWeight: "bold"}}>
                          Amount: {obj.body.amount} {obj.body.asset}
                        </Text>
                        <Text style={{color: "#fff", fontWeight: "bold"}}>
                          Asset: {obj.body.asset}
                        </Text>
                      </View>
                      <View style={{width: "30%", justifyContent: "center"}}>
                        <View style={{backgroundColor: obj.body.status === "pending" ? "orange" : "green", padding: 10, borderRadius: 5}}>
                          <Text style={{color: "#fff", fontWeight: "bold", alignSelf: "center"}}>
                            {obj.body.status}
                          </Text>
                        </View>
                      </View>
                      </View>
                      </TouchableOpacity>
                  </View>
                )
              })
          }
          </ScrollView> */}
          <ScrollView horizontal={true}>
            {
              userDoc.map((obj, index) => {
                if(obj.userID !== auth.currentUser.uid){
                  return null
                }
                return(
                  <TouchableOpacity onPress={() => {
                    setLoadings(<ActivityIndicator size="large" />)
                    setCurrentApiKey(obj.APIKey);
                    setCurrentApiSecret(obj.APISecret);
                    return getList(obj.APIKey, obj.APISecret);
                  }}>
                <View key={index} style={{flexDirection: "row", width: 300, borderRadius: 20, marginVertical: 10, marginHorizontal: 10, alignSelf: "center", padding: 20, borderWidth: 1, borderColor: "#c4c5c650"}}>
                  <View style={{width: "20%", justifyContent: "center"}}>
                    <Image style={{height: 40, width: 40}} source={{uri: obj.Exchange === "Binance" ? "https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png" : ""}} />
                  </View>
                  <View style={{width: "60%", justifyContent: "center"}}>
                    <Text style={{color: "#fff", fontSize: 16, fontWeight: "900"}}>{obj.ExchangeName}</Text>
                    <Text style={{color: "#fff", fontSize: 12, fontWeight: "900"}}>API Key: {obj.APIKey.substring(0, 10)}...</Text>
                  </View>
                  <View style={{width: "20%", justifyContent: "center"}}>
                    {/* <TouchableOpacity>
                      <MaterialCommunityIcons name="close" style={{alignSelf: "flex-end"}} size={24} color="#fff" />
                    </TouchableOpacity> */}
                  </View>
                </View>
                </TouchableOpacity>
                );
              })
            }
            </ScrollView>
        <ScrollView style={{height: 500}}>
        {
          renderStats.length > 0 ?
          renderStats.map((obj, index) => {

            if(parseFloat(obj.free) <= 0){
              return null;
            }

            var pair = `${obj.asset}USDT`;
            const x = parseFloat(dailyStat.find(x => x.symbol === pair).lastPrice);
            const y = parseFloat(dailyStat.find(x => x.symbol === pair).priceChangePercent);
            const price = (x === undefined) ? "0.0000" : x.toFixed(4);
            const priceChangePercent = (y === undefined) ? "0" : y.toFixed(4);
            return(
              <View key={index} style={{flexDirection: "row", width: "98%", borderRadius: 20, marginVertical: 10, alignSelf: "center", padding: 20, borderWidth: 1, borderColor: "#c4c5c650"}}>
                <View style={{width: "20%", justifyContent: "center"}}>
                  <Text style={{color: "#fff", fontSize: 16, fontWeight: "900"}}>{obj.asset}</Text>
                </View>
                <View style={{width: "30%", justifyContent: "center"}}>
                  <Text style={{color: "#fff", fontSize: 16, fontWeight: "900"}}>{price}</Text>
                  <Text style={{color: "#fff", fontSize: 12, fontWeight: "900"}}>Price</Text>
                </View>
                <View style={{width: "30%", justifyContent: "center"}}>
                  <Text style={{color: "#fff", fontSize: 16, fontWeight: "900"}}>{parseFloat(obj.free).toFixed(4)}</Text>
                  <Text style={{color: "#fff", fontSize: 12, fontWeight: "900"}}>Balance</Text>
                </View>
                <View style={{width: "20%", justifyContent: "center"}}>
                  <View style={{backgroundColor: parseFloat(priceChangePercent) < 0 ? "red" : "green", padding: 5, borderRadius: 3}}>
                    <Text style={{color: "#fff", fontSize: 12, fontWeight: "900", alignSelf: "center"}}>{priceChangePercent}%</Text>
                  </View>
                </View>
              </View>
            )
          })
          :
          <>
            {loading}
              <Text style={{alignSelf: "center", color: "#fff", fontSize: 14, fontWeight: "900"}}>No Data to fetch</Text>
              <Text style={{alignSelf: "center", color: "#fff", fontSize: 12, fontWeight: "900"}}>Try clicking your connected account above</Text>
            </>
        }
        <View style={{height: 20}} />
        </ScrollView>

        </Box>
        <View style={{height: 50}} />
        <Box style={styles.containerBackground}>
        {
          userDoc.length <= 0 ? 
            <>
              <Text style={{alignSelf: "center", color: "#fff", fontSize: 14, fontWeight: "900"}}>No Data to fetch</Text>
              {/* <Text style={{alignSelf: "center", color: "#fff", fontSize: 12, fontWeight: "900"}}>Try clicking your connected account above</Text> */}
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
                <View key={index} style={{flexDirection: "row", width: 300, borderRadius: 20, marginVertical: 10, marginHorizontal: 10, alignSelf: "center", padding: 20, borderWidth: 1, borderColor: "#c4c5c650"}}>
                  <View style={{width: "20%", justifyContent: "center"}}>
                    <Image style={{height: 40, width: 40}} source={{uri: obj.Exchange === "Binance" ? "https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png" : ""}} />
                  </View>
                  <View style={{width: "60%", justifyContent: "center"}}>
                    <Text style={{color: "#fff", fontSize: 16, fontWeight: "900"}}>{obj.ExchangeName}</Text>
                    <Text style={{color: "#fff", fontSize: 12, fontWeight: "900"}}>API Key: {obj.APIKey.substring(0, 10)}...</Text>
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
          </>
        }
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#111827",
  },
  container: {
    padding: 12,
  },
  containerBackground: {
    // flexDirection: Row,
    backgroundColor: "#222831",
    borderWidth: 2,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tableHeader: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingTop: 20,
    padding: 12,
    borderColor: "#fff",
    marginBottom: 10,
  },
  headerTextFirstItem: {
    color: "#fff",
  },
  headerTextSecondItem: {
    color: "#fff",
    marginLeft: 10,
  },
  headerTextThirdItem: {
    color: "#fff",
    marginLeft: 20,
  },
  entry: {
    padding: 16,
    backgroundColor: "#0000ff11",
    borderColor: "#0000ff44",
    color: "#fff",
    fontSize: 15,
  },
  sortIcon: {
    alignSelf: "flex-end",
    marginBottom: 12,
    color: "#fff",
  },
});
