//@ts-nocheck
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import firebase from "../firebase/Config";
import { useGlobalState } from "../components/StateManagement/GlobalState";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";
import { View, TouchableOpacity } from "react-native";
import CustomSidebarMenu from "./CustomSidebarMenu";
import HODL from "../components/Pages/HODLComponent";
import Dashboard from "../components/Pages/Dashboard";
import ConnectExchange from "../components/Pages/MyExchanges";
import UserRegistration from "../screens/UserRegistration";
import { Ionicons } from "@expo/vector-icons";
import Subscription from "../components/Pages/Subscription";
export default function ScreenManager() {
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useGlobalState();

  const Drawer = createDrawerNavigator();

  useEffect(() => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            dispatch({ type: "SET_CURRENT_USER", payload: userData });
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <></>;
  }

  const NavigationDrawerStructure = (props) => {
    //Structure for the navigatin Drawer
    const toggleDrawer = () => {
      //Props to open/close the drawer
      props.navigationProps.toggleDrawer();
    };

    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={toggleDrawer} />
      </View>
    );
  };

  return state.currentUser ? (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerActiveTintColor: "#29C5F6",
          drawerItemStyle: { marginVertical: 5 },
          drawerLabelStyle: {
            color: "#fff",
          },
          headerStyle: { backgroundColor: "#222831" },
          headerTitleStyle: { color: "#fff" },
          headerTintColor: "#fff",
        }}
        drawerContent={(props) => <CustomSidebarMenu {...props} />}
      >
        <Drawer.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            drawerLabel: "Dashboard",
            drawerIcon: ({ size }) => (
              <Ionicons name="desktop-outline" size={size} color={"#ccc"} />
            ),
          }}
        />
        <Drawer.Screen
          name="MyExchanges"
          component={ConnectExchange}
          options={{
            drawerLabel: "DCA Bot",
            drawerIcon: ({ size }) => (
              <Ionicons name="list-outline" size={size} color={"#ccc"} />
            ),
          }}
        />
        <Drawer.Screen
          name="SmartTrading"
          component={HODL}
          options={{
            drawerLabel: "HODL Bot",
            drawerIcon: ({ size }) => (
              <Ionicons name="analytics-outline" size={size} color={"#ccc"} />
            ),
          }}
        />
        <Drawer.Screen
          name="TradingBots"
          component={ConnectExchange}
          options={{
            drawerLabel: "Trading Bots",
            drawerIcon: ({ size }) => (
              <Ionicons name="rocket-outline" size={size} color={"#ccc"} />
            ),
          }}
        />
        <Drawer.Screen
          name="Subscription"
          component={Subscription}
          options={{
            drawerLabel: "Subscription",
            drawerIcon: ({ size }) => (
              <Ionicons name="card-outline" size={size} color={"#ccc"} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  ) : (
    <UserRegistration />
  );
}
