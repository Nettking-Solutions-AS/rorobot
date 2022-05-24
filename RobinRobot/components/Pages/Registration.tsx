/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Link,
  Select,
} from "native-base";
import { StyleSheet, SafeAreaView } from "react-native";
import firebase from '../../firebase/Config'
import { validateEmail, validateName, validatePassword } from '../../lib/Validation'
import { Error } from "../../lib/Types.d";

const Registration = ({ navigation }) => {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<Error[]>([]);

  const getErrorsByType = (type: string) =>
  errors.filter((e) => e.type === type);

  const onRegisterPress = () => {
    const validationErrors = [
      ...validateEmail(email),
      ...validatePassword(password, confirmPassword),
      ...validateName(name)
    ];
  
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        if (!response.user) {
          throw new Error('Brukeren er ikke definert')
        }
        const { uid } = response.user
        const data = {
          id: uid,
          email,
          name,
          role: 'customer'
        }
        const usersRef = firebase.firestore().collection('users')
        usersRef
          .doc(uid)
          .set(data)
          .catch((error) => {
            setMessage('Feilet: ' + error.message)
          })
      })
      .catch((error) => {
        setMessage('Feilet: ' + error.message)
      })
      navigation.navigate('Dashboard')
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <NativeBaseProvider>
        <Box flex={1} p={2} w="90%" mx="auto">
          <Heading size="2xl" color="primary.500">
            Velkommen!
          </Heading>
          <Heading color="#292929" size="md">
            Registrer deg for å fortsette!
          </Heading>

          <VStack space={2} mt={5}>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("name").length > 0}
            >
              <FormControl.Label
                _text={{
                  color: "#121212",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Navn
              </FormControl.Label>
              <Input
                size="lg"
                type="text"
                onChangeText={(text) => setName(text)}
              />
              <FormControl.ErrorMessage
                _text={{ color: "#e22134", fontSize: "md" }}
              >
                {getErrorsByType("name").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("email").length > 0}
            >
              <FormControl.Label
                _text={{
                  color: "#121212",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Epost
              </FormControl.Label>
              <Input
                size="lg"
                onChangeText={(text) => setEmail(text)}
              />
              <FormControl.ErrorMessage
                _text={{ color: "#e22134", fontSize: "md" }}
              >
                {getErrorsByType("email").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("password").length > 0}
            >
              <FormControl.Label
                _text={{
                  color: "#121212",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Passord
              </FormControl.Label>
              <Input
                size="lg"
                type="password"
                onChangeText={(text) => setPassword(text)}
              />
              <FormControl.ErrorMessage
                _text={{ color: "#e22134", fontSize: "md" }}
              >
                {getErrorsByType("password").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={getErrorsByType("confirmPassword").length > 0}
            >
              <FormControl.Label
                _text={{
                  color: "#121212",
                  fontSize: "lg",
                  fontWeight: 500,
                }}
              >
                Bekreft passord
              </FormControl.Label>
              <Input
                size="lg"
                type="password"
                onChangeText={(text) => setConfirmPassword(text)}
              />
              <FormControl.ErrorMessage
                _text={{ color: "#e22134", fontSize: "md" }}
              >
                {getErrorsByType("confirmPassword").map((e) => e.message)}
              </FormControl.ErrorMessage>
            </FormControl>
            <VStack space={2} mt={5}>
              <Button
                size="md"
                colorScheme="cyan"
                _text={{ color: "#121212" }}
                onPress={onRegisterPress}
              >
                Registrer deg
              </Button>
            </VStack>
            <HStack justifyContent="center">
              <Text fontSize="md" color="#121212" fontWeight={400}>
                Har du allerede bruker?{" "}
              </Text>
              <Link
                _text={{ color: "primary.500", bold: true, fontSize: "md" }}
                onPress={() => navigation.navigate('Login')}
              >
                Logg inn
              </Link>
            </HStack>
          </VStack>
        </Box>
      </NativeBaseProvider>
    </SafeAreaView>
  );
}

export default Registration