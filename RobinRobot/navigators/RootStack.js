import React from "react";

// React Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// styled components
import { colors } from "../components/colors";

// Screens
import Login from '../components/Pages/Login'
import Registration from '../components/Pages/Registration'
import MyExchanges from '../components/Pages/MyExchanges'
import EmailVerification from '../components/Pages/EmailVerification'
import ForgotPassword from '../components/Pages/ForgotPassword'
import Dashboard from '../screens/Dashboard'
import Avatar from '../components/Buttons/Avatar'

const { accent, secondary, darkGray } = colors;

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
              headerTintColor: accent,
              headerStyle: {
                height: 100,
                backgroundColor: secondary,
                borderBottomWidth: 0,
                shadowColor: 'transparent',
                shadowOpacity: 0,
                elevation: 0
              },
              headerLeftContainerStyle: {
                paddingLeft: 10
              },
              headerRightContainerStyle: {
                paddingRight: 25
              }
            }}
            initialRouteName='Login'
        >
            <Stack.Screen
                name='Login'
                component={Login}
                options={{
                  headerShown: false
                }}
            />
            <Stack.Screen
                name='Registration'
                component={Registration}
                options={{
                  headerShown: false
                }}
            />
            <Stack.Screen
                name='EmailVerification'
                component={EmailVerification}
                options={{
                  headerShown: false
                }}
            />
            <Stack.Screen
                name='ForgotPassword'
                component={ForgotPassword}
                options={{
                  headerShown: false
                }}
            />
            <Stack.Screen
                name='Dashboard'
                component={Dashboard}
                options={{
                  headerTitle: 'Dashbord',
                  headerTitleAlign: 'left',
                  headerStyle: {
                    height: 100,
                    backgroundColor: darkGray,
                    borderBottomWidth: 0,
                    shadowColor: 'transparent',
                    shadowOpacity: 0,
                    elevation: 0
                  },
                  headerRight: () => <Avatar />

                }}
            />
            <Stack.Screen 
              name='MyExchanges'
              component={MyExchanges}
              options={{
                  headerShown: false
                }}
            />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
