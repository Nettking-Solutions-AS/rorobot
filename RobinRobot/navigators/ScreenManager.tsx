import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import firebase from '../firebase/Config'
import { useGlobalState } from "../components/StateManagement/GlobalState";
import Registration from "../components/Pages/Registration";
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { View, TouchableOpacity } from 'react-native';
import CustomSidebarMenu from './CustomSidebarMenu';
import Dashboard from '../components/Pages/Dashboard';
import ConnectExchange from '../components/Pages/MyExchanges';
import UserRegistration from "../screens/UserRegistration";

export default function ScreenManager() {
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = useGlobalState();

    const Stack = createStackNavigator();
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
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={toggleDrawer} />
          </View>
        );
    };
      
    function firstScreenStack({ navigation }) {
        return (
          <Stack.Navigator initialRouteName="Registration">
            <Stack.Screen
              name="Registration"
              component={Registration}
              options={{
                title: 'Registration', //Set Header Title
                headerLeft: () => (
                  <NavigationDrawerStructure navigationProps={navigation} />
                ),
                headerStyle: {
                  backgroundColor: '#f4511e', //Set Header color
                },
                headerTintColor: '#fff', //Set Header text color
                headerTitleStyle: {
                  fontWeight: 'bold', //Set Header text style
                },
              }}
            />
          </Stack.Navigator>
        );
    }
      
    function secondScreenStack({ navigation }) {
        return (
          <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
              headerLeft: () => (
                <NavigationDrawerStructure navigationProps={navigation} />
              ),
              headerStyle: {
                backgroundColor: '#f4511e', //Set Header color
              },
              headerTintColor: '#fff', //Set Header text color
              headerTitleStyle: {
                fontWeight: 'bold', //Set Header text style
              },
            }}>
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{
                title: 'Dashboard', //Set Header Title
              }}
            />
            <Stack.Screen
              name="MyExchanges"
              component={ConnectExchange}
              options={{
                title: 'Connect Exchange', //Set Header Title
              }}
            />
          </Stack.Navigator>
        );
    }

    return state.currentUser ? (
        <NavigationContainer>
            <Drawer.Navigator
                screenOptions={{
                activeTintColor: '#e91e63',
                itemStyle: { marginVertical: 5 },
                }}
                drawerContent={(props) => <CustomSidebarMenu {...props} />}>
                <Drawer.Screen
                name="Dashboard"
                options={{ drawerLabel: 'Dashboard' }}
                component={Dashboard}
                />
                <Drawer.Screen
                name="MyExchanges"
                options={{ drawerLabel: 'My Exchanges' }}
                component={ConnectExchange}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    ) : (
        <UserRegistration />
    )
}