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
const { primary } = colors

const Login = () => {
  const [message, setMessage] = useState('')
  const [isSuccessMessage, setIsSuccessMessage] = useState(false)

  const handleLogin = async (credentials, setSubmitting) => {
    try {
      setMessage(null)

      // call backendered

      // move to next page

      setSubmitting(false)
    } catch (error) {
      setMessage('Innlogging feilet: ' + error.message)
      setSubmitting(false)
    }
  }

  return <MainContainer>
        <KeyboardAvoidingContainer>
            <RegularText style={{ marginBottom: 25 }}>skriv inn kontolegitimasjonen din</RegularText>

            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={(values, setSubmitting) => {
                  if (values.email === '' || values.password === '') {
                    setMessage('Vennligst fyll inn alle feltene')
                    setSubmitting(false)
                  } else {
                    handleLogin(values, setSubmitting)
                  }
                }}
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
                            <PressableText onPress={() => {}}>Opprett ny konto</PressableText>
                            <PressableText onPress={() => {}}>Glemt passord</PressableText>
                        </RowContainer>
                    </>
                )}
            </Formik>
        </KeyboardAvoidingContainer>
    </MainContainer>
}

export default Login
