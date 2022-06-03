import React, { useState, useEffect } from 'react'
import {
  FormControl, Text, Input, WarningOutlineIcon, Icon
} from "native-base";
import { MaterialIcons } from '@expo/vector-icons'
import { Error } from "../../lib/Types.d";
import { validateEmail } from '../../lib/Validation'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

// custom components
import MainContainer from '../Containers/MainContainer'
import KeyboardAvoidingContainer from '../Containers/KeyboardAvoidingContainer'
import RegularText from '../Texts/RegularText'
import RegularButton from '../Buttons/RegularButton'
import IconHeader from '../Icons/IconHeader'
import MsgBox from '../Texts/MsgBox'

const ForgotPassword = ({ navigation }: { navigation: any }) => {
  const [errors, setErrors] = useState<Error[]>([]);
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [timerCount, setTimer] = useState(10)

  const getErrorsByType = (type: string) =>
  errors.filter((e) => e.type === type);

  const handleOnSubmit = () => {
    const validationErrors = [
      ...validateEmail(email)
    ]

    setErrors(validationErrors)
    if (validationErrors.length === 0) {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          setMessage('Please check your email for further instructions. Redirecting to login in ' + {timerCount} + 'second(s).')
          setTimeout(() => {
            navigation.navigate('Login')
          }, 10000)
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setMessage('Error code: ' + errorCode + '\n' + 'Error message: ' + errorMessage)
        })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(lastTimerCount => {
          lastTimerCount <= 1 && clearInterval(interval)
          return lastTimerCount - 1
      })
    }, 1000) //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval)
  }, []);

  return (
    <MainContainer>
        <KeyboardAvoidingContainer>
            <IconHeader name='key' style={{ marginBottom: 30 }} color={undefined} />
            <RegularText style={{ marginBottom: 25 }}>Fill in your credentials to start the process</RegularText>

            <FormControl
              isRequired
              isInvalid={getErrorsByType("email").length > 0}
            >
              <FormControl.Label mt={25}>
                <Text bold>Email</Text>
              </FormControl.Label>

              <Input
                InputLeftElement={<Icon as={<MaterialIcons name='email' />} 
                size={7}
                ml='4'
                color='cyan.300' />} 
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

            <RegularButton style={{ marginTop: 25 }} onPress={handleOnSubmit}>Register</RegularButton>

            <MsgBox style={{ marginTop: 25 }}>{ message || ' '}</MsgBox>
        </KeyboardAvoidingContainer>
    </MainContainer>
  )
}

export default ForgotPassword
