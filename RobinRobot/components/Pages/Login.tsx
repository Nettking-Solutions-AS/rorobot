import * as React from "react";
import {
  FormControl,
} from "native-base";
import { useState } from "react";
import { StyleSheet } from "react-native";
import firebase from "../../firebase/Config";
import { Error } from "../../lib/Types";
import { validateEmail, validatePassword } from '../../lib/Validation';
import MainContainer from "../Containers/MainContainer";
import KeyboardAvoidingContainer from '../Containers/KeyboardAvoidingContainer'
import RegularText from "../Texts/RegularText";
import StyledTextInput from "../Inputs/StyledTextInput";
import RegularButton from "../Buttons/RegularButton";
import RowContainer from '../Containers/RowContainer'
import PressableText from "../Texts/PressableText";

const Login = ({ navigation }: { navigation: any}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);

  const onLoginPress = () => {
    const validationErrors = [
      ...validateEmail(email),
      ...validatePassword(password),
    ];

    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          const usersRef = firebase.firestore().collection("users");
          usersRef
            .doc(response.user?.uid)
            .get()
            .then((firestoreDocument) => {
              if (!firestoreDocument.exists) {
                // eslint-disable-next-line no-alert
                alert("Brukeren eksisterer ikke!");
                // return;
              }
              navigation.navigate('Dashboard', { name: 'Aleksander'})
              // const user = firestoreDocument.data();
              // TODO: Fetch user items
            })
            .catch((error) => {
              // eslint-disable-next-line no-alert
              alert(error);
            });
        })
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error);
        });
    }
  };

  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  return (
    <MainContainer>
      <KeyboardAvoidingContainer>
        <RegularText style={{ marginBottom: 25 }}>
          Skriv inn kontolegitimasjonen din
        </RegularText>

        <FormControl
          isRequired
           isInvalid={getErrorsByType("email").length > 0}
        >
          <StyledTextInput
            label="E-post"
            isPassword={false}
            onChangeText={(text:string) => setEmail(text)}
            icon="email-variant"
            placeholder="ola@nordmann.no"
            keyboardType="email-address"
            style={{ marginBottom: 25 }}
          />
          
          <FormControl.ErrorMessage
            _text={{ color: "primary.250", fontSize: "md" }}
          >
            {getErrorsByType("email").map((e) => e.message)}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl
          isRequired
          isInvalid={getErrorsByType("password").length > 0}
          mb={5}
        >
            
          <StyledTextInput 
            type="password" 
            onChangeText={(text:string) => setPassword(text)} 
            label="Passord"
            icon="lock-open"
            placeholder="* * * * * * * *"
            isPassword={true}
            style={{ marginBottom: 25 }}
          />
      
          <FormControl.ErrorMessage
            _text={{ color: "primary.250", fontSize: "md" }}
          >
            {getErrorsByType("password").map((e) => e.message)}
          </FormControl.ErrorMessage>
        </FormControl>

        <RegularButton onPress={onLoginPress}>
          Login
        </RegularButton>

        <RowContainer>
          <PressableText onPress={() => navigation.navigate('Registration')}>Opprett ny konto</PressableText>
          <PressableText onPress={() => navigation.navigate('ForgotPassword')}>Glemt passord</PressableText>
        </RowContainer>
        
      </KeyboardAvoidingContainer>
    </MainContainer>
  );
}

export default Login;