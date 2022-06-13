import React, { useState } from "react";
import { FormControl } from "native-base";
import firebase from "../../firebase/Config";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../lib/Validation";
import { Error } from "../../lib/Types.d";
import MainContainer from "../Containers/MainContainer";
import KeyboardAvoidingContainer from "../Containers/KeyboardAvoidingContainer";
import RegularText from "../Texts/RegularText";
import StyledTextInput from "../Inputs/StyledTextInput";
import RegularButton from "../Buttons/RegularButton";
import PressableText from "../Texts/PressableText";

const Registration = ({ navigation }: { navigation: any }) => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);

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
      navigation.navigate("MyExchanges");
    }
  };

  return (
    <MainContainer>
      <KeyboardAvoidingContainer>
        <RegularText style={{ marginBottom: 25 }}>
          Fill inn your account credentials
        </RegularText>

        <FormControl isRequired isInvalid={getErrorsByType("name").length > 0}>
          <StyledTextInput
            label="Full name"
            icon="account"
            placeholder="Ola Nordmann"
            isPassword={false}
            style={{ marginBottom: 15 }}
            onChangeText={(text: string) => setName(text)}
          />

          <FormControl.ErrorMessage
            _text={{ color: "#e22134", fontSize: "md" }}
          >
            {getErrorsByType("name").map((e) => e.message)}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={getErrorsByType("email").length > 0}>
          <StyledTextInput
            label="Email"
            icon="email-variant"
            placeholder="ola@nordmann.no"
            keyboardType="email-address"
            isPassword={false}
            style={{ marginBottom: 15 }}
            onChangeText={(text: string) => setEmail(text)}
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
          <StyledTextInput
            label="Password"
            icon="lock-open"
            placeholder="* * * * * * * *"
            isPassword={true}
            style={{ marginBottom: 15 }}
            onChangeText={(text: string) => setPassword(text)}
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
          <StyledTextInput
            label="Confirm password"
            icon="lock-open"
            placeholder="* * * * * * * *"
            isPassword={true}
            style={{ marginBottom: 15 }}
            onChangeText={(text: string) => setConfirmPassword(text)}
          />

          <FormControl.ErrorMessage
            _text={{ color: "#e22134", fontSize: "md" }}
          >
            {getErrorsByType("confirmPassword").map((e) => e.message)}
          </FormControl.ErrorMessage>
        </FormControl>

        <RegularButton style={{ marginTop: 25 }} onPress={onRegisterPress}>
          Register
        </RegularButton>

        <PressableText
          style={{ paddingVertical: 15 }}
          onPress={() => navigation.navigate("Login")}
        >
          Log in to an existing account
        </PressableText>
      </KeyboardAvoidingContainer>
    </MainContainer>
  );
};

export default Registration;
