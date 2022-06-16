import * as React from "react";
import {
  FormControl, Text, Input, WarningOutlineIcon, Icon
} from "native-base";
import { useState } from "react";
import firebase from "../../firebase/Config";
import { Error } from "../../lib/Types";
import { validateEmail, validatePassword } from "../../lib/Validation";
import MainContainer from "../Containers/MainContainer";
import KeyboardAvoidingContainer from "../Containers/KeyboardAvoidingContainer";
import RegularText from "../Texts/RegularText";
import RegularButton from "../Buttons/RegularButton";
import RowContainer from "../Containers/RowContainer";
import PressableText from "../Texts/PressableText";
import { MaterialIcons } from '@expo/vector-icons'

export default function Login({
  showRegistration,
}: {
  showRegistration: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);
  const [show, setShow] = useState(false)

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
                alert("The user does not exist!")
              }
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
          Fill in your account credentials
        </RegularText>

        <FormControl
          isRequired
          isInvalid={getErrorsByType("email").length > 0}
        >
          <FormControl.Label>
            <Text bold style={{ color: '#fff' }}>Email</Text>
          </FormControl.Label>

          <Input
            InputLeftElement={<Icon as={<MaterialIcons name='email' />} 
            size={7}
            ml='4'
            color='cyan.300' />} 
            color='#fff'
            placeholder='Email'
            height={12}
            fontSize={15}
            borderRadius={10}
            onChangeText={(text:string) => setEmail(text)}
          />

          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {getErrorsByType("email").map((e) => e.message)}
          </FormControl.ErrorMessage>    
        </FormControl>

        <FormControl
          isRequired
          isInvalid={getErrorsByType("password").length > 0}
        >
          <FormControl.Label mt={30}>
            <Text bold style={{ color: '#fff' }}>Password</Text>
          </FormControl.Label>

          <Input
            InputLeftElement={<Icon as={<MaterialIcons name='lock-open' />} 
            size={7}
            ml='4'
            color='cyan.300' />}
            color='#fff' 
            type={show ? 'text' : 'password'}
            InputRightElement={<Icon as={<MaterialIcons name={show ? 'visibility' : 'visibility-off'} />}
            size={7}
            mr='3'
            color='muted.400'
            onPress={() => setShow(!show)}
          />}          
            height={12}
            fontSize={15}
            borderRadius={10}
            placeholder="* * * * * * * *"
            onChangeText={(text:string) => setPassword(text)}
          />

          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {getErrorsByType("password").map((e) => e.message)}
          </FormControl.ErrorMessage>
        </FormControl>

        <RegularButton onPress={onLoginPress} style={{ marginTop: 30}}>
          Log in
        </RegularButton>

        <RowContainer>
          <PressableText onPress={showRegistration}>
            Create new account
          </PressableText>
          <PressableText onPress={showRegistration}>
            Forgot password
          </PressableText>
        </RowContainer>
      </KeyboardAvoidingContainer>
    </MainContainer>
  );
}
