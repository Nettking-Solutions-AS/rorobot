import axios from "axios"
import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Table, Row, Rows } from "react-native-table-component"
import { FontAwesome } from "@expo/vector-icons";
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
  const [loading, setLoading] = useState(false)
  const [sortType, setSortType] = useState<"ascending" | "descending">("ascending")

  const fetchData = useCallback(async () => {
    setLoading(true)
    const uri = "https://robinserver.onrender.com";
    const { data: response } = await axios.post<Data>(uri, { userID: state.currentUser.id });

    setData(response.result.balances)

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
    <ScrollView style={{}} contentContainerStyle={styles.container} >
      {loading ? <ActivityIndicator size="large" /> : <Table>
        <FontAwesome name="unsorted" size={32} style={styles.sortIcon} onPress={() => setSortType(sortType === "ascending" ? "descending" : "ascending")} />
        <Row data={["Token", "Amount"]} style={styles.tableHeader} textStyle={[styles.headerText]} />
        <Rows data={data.map(entry =>
          [entry.asset, ((entry.free * 10 + entry.locked * 10) / 10).toFixed(8)]
        )} textStyle={[styles.entry]} />
      </Table>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { 
    padding: 12 
  },
  tableHeader: { 
    borderWidth: 1, 
    padding: 12, 
    backgroundColor: "#0000ff22", 
    borderColor: "#0000ff44" 
  },
  headerText: { 
    fontWeight: "bold" 
  },
  entry: { 
    borderWidth: 1, 
    padding: 4, 
    backgroundColor: "#0000ff11", 
    borderColor: "#0000ff44" 
  },
  sortIcon: { 
    alignSelf: "flex-end", 
    marginBottom: 12 
  }
})