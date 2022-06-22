import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { Octicons } from "@expo/vector-icons";
import { Text, HStack, Center, Box } from "native-base";
import { useGlobalState } from "../StateManagement/GlobalState";
import { Coin, Stat } from "../../lib/Types";

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
  const [sortType, setSortType] = useState<"ascending" | "descending">(
    "ascending"
  );
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
      "https://robinserver.onrender.com/getDailyStats",
      { userID: state.currentUser.id }
    );
    setDailyStats(fetchedStats.result);
    setLoadingStats(false);
  }, []);

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    const uri = "https://robinserver.onrender.com/getCapitalConfigs";
    const { data: response } = await axios.post<Data>(uri, {
      userID: state.currentUser.id,
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

  useEffect(() => {
    (async () => {
      await fetchCoins();
      await fetchDailyStats();
    })();
  }, []);

  return (
    <ScrollView
      style={styles.background}
      contentContainerStyle={styles.container}
    >
      <Box style={styles.containerBackground}>
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
    flexDirection: Row,
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
