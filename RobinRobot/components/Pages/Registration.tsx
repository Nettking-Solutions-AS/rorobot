import React, { useState } from "react";
import {
  FormControl, Text, Input, WarningOutlineIcon, Icon
} from "native-base";
import firebase from '../../firebase/Config'
import { validateEmail, validateName, validatePassword } from '../../lib/Validation'
import { Error } from "../../lib/Types.d";
import MainContainer from "../Containers/MainContainer";
import KeyboardAvoidingContainer from "../Containers/KeyboardAvoidingContainer";
import RegularText from "../Texts/RegularText";
import RegularButton from "../Buttons/RegularButton";
import PressableText from "../Texts/PressableText";
import { MaterialIcons } from '@expo/vector-icons'
import MsgBox from '../Texts/MsgBox'

export default function Registration({ showLogin }: { showLogin: () => void }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);
  const [show, setShow] = useState(false)

  const getErrorsByType = (type: string) =>
    errors.filter((e) => e.type === type);

  const onRegisterPress = () => {
    const validationErrors = [
      ...validateEmail(email),
      ...validatePassword(password, confirmPassword),
      ...validateName(name),
    ];

    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          if (!response.user) {
            throw new Error("The user is not defined");
          }
          const { uid } = response.user;
          const data = {
            id: uid,
            email,
            name,
            role: "customer",
          };
          const usersRef = firebase.firestore().collection("users");
          usersRef
            .doc(uid)
            .set(data)
            .catch((error) => {
              setMessage("Feilet: " + error.message);
            });
        })
        .catch((error) => {
          setMessage("Feilet: " + error.message);
        });
    }
  };

  return (
    <MainContainer>
      <KeyboardAvoidingContainer>
        <RegularText style={{ marginBottom: 25 }}>
          Fill inn your account credentials
        </RegularText>

        <FormControl
          isRequired
          isInvalid={getErrorsByType("name").length > 0}
        >
          <FormControl.Label>
            <Text bold style={{ color: '#fff' }}>Full name</Text>
          </FormControl.Label>

          <Input
            InputLeftElement={<Icon as={<MaterialIcons name='person' />} 
            size={7}
            ml='3'
            color='cyan.300' />} 
            color='#fff'
            placeholder='Name'
            height={12}
            fontSize={15}
            borderRadius={10}
            onChangeText={(text:string) => setName(text)}
          />

          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {getErrorsByType("name").map((e) => e.message)}
          </FormControl.ErrorMessage>    
        </FormControl>

        <FormControl
          isRequired
          isInvalid={getErrorsByType("email").length > 0}
        >
          <FormControl.Label mt={25}>
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

        <FormControl
          isRequired
          isInvalid={getErrorsByType("confirmPassword").length > 0}
        >
          <FormControl.Label mt={30}>
            <Text bold style={{ color: '#fff' }}>Confirm password</Text>
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
            onChangeText={(text:string) => setConfirmPassword(text)}
          />

          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {getErrorsByType("confirmPassword").map((e) => e.message)}
          </FormControl.ErrorMessage>
        </FormControl>

        <RegularButton style={{ marginTop: 25 }} onPress={onRegisterPress}>
          Register
        </RegularButton>

        <PressableText
          style={{ paddingVertical: 15 }}
          onPress={showLogin}
        >
          Log in to an existing account
        </PressableText>

        <MsgBox style={{ marginTop: 25 }}>{ message || ' '}</MsgBox>
            
      </KeyboardAvoidingContainer>
    </MainContainer>
  );
}
