import axios from "axios"
import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Table, Row, Rows } from "react-native-table-component"
import { Octicons } from "@expo/vector-icons";
import { Text, HStack, Center, Box, Hidden } from "native-base"
import { useGlobalState } from "../StateManagement/GlobalState";

interface Balance {
  asset: string;
  free: string;
  locked: string;
  amount: string;
}

interface Data {
  result: {
    balances: Balance[]
  }
}

export default function Dashboard() {
  const { state } = useGlobalState();
  const [data, setData] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState<"ascending" | "descending">("ascending");
  const [sortIconChange, setsortIconChange] = useState<"sort-asc" | "sort-desc" | "unfold">("unfold");

  const amount = () => (
    <HStack space={1}>
      <Center mb="3" mr="2">
        <Text bold style={styles.headerText}>Amount</Text>
      </Center>
      <Center>
        <Octicons name={sortIconChange} size={22} style={styles.sortIcon} onPress={() => combinedOnPress()} />
      </Center>
    </HStack>
  );

  const token = () => (
    <HStack space={1}>
      <Center mb="3" mr="2">
        <Text bold style={styles.headerTextFirstItem}>Token</Text>
      </Center>
      <Center>
        <Octicons name="unfold" size={22} style={styles.sortIcon} />
      </Center>
    </HStack>
  );

  const combinedOnPress = () => {
    setSortType(sortType === "ascending" ? "descending" : "ascending");
    setsortIconChange(sortIconChange === "sort-asc" ? "sort-desc" : "sort-asc");
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    const uri = "https://robinserver.onrender.com";
    const { data: response } = await axios.post<Data>(uri, { userID: state.currentUser.id });

    let entries = response.result.balances.filter(entity => entity.free > 0 || entity.locked > 0).map(entry => ({ ...entry, amount: ((entry.free * 10 + entry.locked * 10) / 10).toFixed(8) }))

    entries = entries.sort((a, b) => a.amount > b.amount ? 1 : -1)

    setData(entries)
    setLoading(false)
  }, [])

  useEffect(() => {
    setData(data.sort((a, b) => (sortType === "ascending" ? a : b).amount > (sortType === "ascending" ? b : a).amount ? 1 : -1))
  }, [sortType, data])

  useEffect(() => {
    (async () => {
      await fetchData()
    })()
  }, []);

  return (
    <ScrollView style={styles.background} contentContainerStyle={styles.container} >
      <Box style={styles.containerBackground}>
        {loading ? <ActivityIndicator size="large" /> : <Table>
          <Row data={[token(), amount()]} style={styles.tableHeader} textStyle={[styles.headerText]} />
          <Rows data={data.map(entry =>
            [entry.asset, ((entry.free * 10 + entry.locked * 10) / 10).toFixed(8)]
          )} textStyle={[styles.entry]} />
        </Table>}
      </Box>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#111827"
  },
  container: { 
    padding: 12 
  },
  containerBackground: {
    flexDirection: Row,
    backgroundColor: "#222831",
    borderWidth: 2,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  tableHeader: { 
    borderTopWidth: 1, 
    borderBottomWidth: 1,
    paddingTop: 20,
    padding: 12, 
    borderColor: "#fff",
    marginBottom: 10 
  },
  headerTextFirstItem: { 
    color: "#fff",
  },
  headerText: {
    color: "#fff",
    marginLeft: 10
  },
  entry: {  
    padding: 16, 
    backgroundColor: "#0000ff11", 
    borderColor: "#0000ff44",
    color: "#fff",
    fontSize: 15
  },
  sortIcon: { 
    alignSelf: "flex-end", 
    marginBottom: 12,
    color: "#fff"
  }
})