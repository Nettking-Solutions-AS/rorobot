/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Formik } from 'formik'
import { ActivityIndicator } from 'react-native'

import { colors } from '../components/colors'

// custom components
import MainContainer from '../components/Containers/MainContainer'
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoidingContainer'
import RegularText from '../components/Texts/RegularText'
import StyledTextInput from '../components/Inputs/StyledTextInput'
import MsgBox from '../components/Texts/MsgBox'
import RegularButton from '../components/Buttons/RegularButton'
import PressableText from '../components/Texts/PressableText'
import RowContainer from '../components/Containers/RowContainer'
import firebase from '../firebase/Config'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
const { primary } = colors

const Login = ({ navigation }) => {
  const [message, setMessage] = useState('')
  const [isSuccessMessage, setIsSuccessMessage] = useState(false)

  const moveTo = (screen, payload) => {
    navigation.navigate(screen, { ...payload })
  }

  const hasValid = values => {
    const { email, password } = values
    if (!email) {
      setMessage('E-post er påkrevd!')
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setMessage('Ugyldig e-post')
    }
    if (!password) {
      setMessage('Passord er påkrevd!')
    } else if (/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$/i.test(password)) {
      setMessage('Passordet må ha minst 8 tegn, en bokstav og ett tall')
    }
  }

  const handleLogin = async (email, password) => {
    // call backend
    if (setMessage.length === 0) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          const user = userCredentials.user
          // move to next page
          moveTo('Dashboard')
        })
        .catch((error) => {
          setMessage('Innlogging feilet ' + error.message)
        })
    }
  }

  return (
    <MainContainer>
        <KeyboardAvoidingContainer>
            <RegularText style={{ marginBottom: 25 }}>skriv inn kontolegitimasjonen din</RegularText>

            <Formik
                initialValues={{ email: '', password: '' }}
                validate={hasValid}
                onSubmit={(values) => {
                  const { email, password } = values
                  handleLogin(email, password)
                }
                }
            >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                    <>
                        <StyledTextInput
                            label="E-post"
                            icon="email-variant"
                            placeholder="ola@nordmann.no"
                            keyboardType="email-address"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            style={{ marginBottom: 25 }}
                        />

                        <StyledTextInput
                            label="Passord"
                            icon="lock-open"
                            placeholder="* * * * * * * *"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            isPassword={true}
                            style={{ marginBottom: 25 }}
                        />

                        <MsgBox style={{ marginBottom: 25 }} success={isSuccessMessage}>{ message || ' '}</MsgBox>

                        {!isSubmitting && <RegularButton onPress={handleSubmit}>Login</RegularButton>}
                        {isSubmitting && (
                            <RegularButton disabled={true}>
                                <ActivityIndicator size="small" color={primary} />
                            </RegularButton>
                        )}

                        <RowContainer>
                            <PressableText onPress={() => { moveTo('Signup') }}>Opprett ny konto</PressableText>
                            <PressableText onPress={() => { moveTo('ForgotPassword') }}>Glemt passord</PressableText>
                        </RowContainer>
                    </>
                )}
            </Formik>
        </KeyboardAvoidingContainer>
    </MainContainer>
  )
}

export default Login
