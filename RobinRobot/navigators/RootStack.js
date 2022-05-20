/* eslint-disable react/prop-types */
import React from 'react'

// React Navigation
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

// styled components
import { colors } from '../components/colors'

// Screens
import Login from '../screens/Login'
import Signup from '../screens/Signup'
import EmailVerification from '../screens/EmailVerification'
import ForgotPassword from '../screens/ForgotPassword'
import ResetPassword from '../screens/ResetPassword'
import Dashboard from '../screens/Dashboard'

const { accent, secondary } = colors

const Stack = createStackNavigator()

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
                options={{ headerTitle: 'Logg Inn', headerTitleAlign: 'left' }}
            />
            <Stack.Screen
                name='Signup'
                component={Signup}
                options={{ headerTitle: 'Registrer Deg', headerTitleAlign: 'left' }}
            />
            <Stack.Screen
                name='EmailVerification'
                component={EmailVerification}
                options={{ headerTitle: 'Bekreft E-post', headerTitleAlign: 'left' }}
            />
            <Stack.Screen
                name='ForgotPassword'
                component={ForgotPassword}
                options={{ headerTitle: 'Glemt Passord', headerTitleAlign: 'left' }}
            />
            <Stack.Screen
                name='ResetPassword'
                component={ResetPassword}
                options={{ headerTitle: 'Tilbakestill Passord', headerTitleAlign: 'left' }}
            />
            <Stack.Screen
                name='Dashboard'
                component={Dashboard}
                options={{ headerTitle: 'Dashbord', headerTitleAlign: 'left' }}
            />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootStack
