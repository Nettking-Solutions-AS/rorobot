import axios from "axios"
import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { Table, TableWrapper, Row, Col, Cell, Cols, Rows } from "react-native-table-component"

import { useGlobalState } from "../StateManagement/GlobalState";

interface Balance {
  asset: string;
  free: string;
  locked: string;
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


  const fetchData = useCallback(async () => {
    setLoading(true)
    const uri = "https://robinserver.onrender.com";
    const { data: response } = await axios.post<Data>(uri, { userID: state.currentUser.id });
    setData(response.result.balances)
    setLoading(false)
  }, [])

  useEffect(() => {
    (async () => {
      await fetchData()
    })()
  }, []);

  return (
    <ScrollView style={{}} contentContainerStyle={styles.container} >
      <Table>
        <Row data={["Token", "Amount"]} style={styles.tableHeader} textStyle={styles.headerText} />
        <Rows data={data.map(entry => [entry.asset, parseFloat(entry.free) + parseFloat(entry.locked)])} textStyle={styles.entry} />
      </Table>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  tableHeader: { borderWidth: 1, padding: 12, backgroundColor: "#0000ff22", borderColor: "#0000ff44" },
  headerText: { fontWeight: "bold" },
  entry: { borderWidth: 1, padding: 4, backgroundColor: "#0000ff11", borderColor: "#0000ff44" }
})