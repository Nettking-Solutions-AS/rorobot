import React, { useState } from 'react'
import { Formik } from 'formik'
import { ActivityIndicator } from 'react-native'

// custom components
import MainContainer from '../components/Containers/MainContainer'
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoidingContainer'
import RegularText from '../components/Texts/RegularText'
import StyledTextInput from '../components/Inputs/StyledTextInput'
import MsgBox from '../components/Texts/MsgBox'
import RegularButton from '../components/Buttons/RegularButton'
import { colors } from '../components//colors'
import PressableText from '../components/Texts/PressableText'
const { primary } = colors

const Signup = () => {
  const [message, setMessage] = useState('')
  const [isSuccessMessage, setIsSuccessMessage] = useState(false)

  const handleSignup = async (credentials, setSubmitting) => {
    try {
      setMessage(null)

      // call backendered

      // move to next page

      setSubmitting(false)
    } catch (error) {
      setMessage('Registrering feilet: ' + error.message)
      setSubmitting(false)
    }
  }

  return <MainContainer>
        <KeyboardAvoidingContainer>
            <RegularText style={{ marginBottom: 25 }}>skriv inn kontolegitimasjonen din</RegularText>

            <Formik
                initialValues={{ email: '', fullName: '', password: '', confirmPassword: '' }}
                onSubmit={(values, setSubmitting) => {
                  if (values.email === '' || values.fullName === '' || values.password === '' || values.confirmPassword === '') {
                    setMessage('Vennligst fyll inn alle feltene')
                    setSubmitting(false)
                  } else if (values.password !== values.confirmPassword) {
                    setMessage('Passordene er ikke like')
                    setSubmitting(false)
                  } else {
                    handleSignup(values, setSubmitting)
                  }
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                    <>
                        <StyledTextInput
                            label="Fullt Navn"
                            icon="account"
                            placeholder="Ola Nordmann"
                            onChangeText={handleChange('fullName')}
                            onBlur={handleBlur('fullName')}
                            value={values.fullName}
                            style={{ marginBottom: 15 }}
                        />

                        <StyledTextInput
                            label="E-post"
                            icon="email-variant"
                            placeholder="ola@nordmann.no"
                            keyboardType="email-address"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            style={{ marginBottom: 15 }}
                        />

                        <StyledTextInput
                            label="Passord"
                            icon="lock-open"
                            placeholder="* * * * * * * *"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            isPassword={true}
                            style={{ marginBottom: 15 }}
                        />

                        <StyledTextInput
                            label="Bekreft Passord"
                            icon="lock-open"
                            placeholder="* * * * * * * *"
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            isPassword={true}
                            style={{ marginBottom: 15 }}
                        />

                        <MsgBox style={{ marginBottom: 25 }} success={isSuccessMessage}>{ message || ' '}</MsgBox>

                        {!isSubmitting && <RegularButton onPress={handleSubmit}>Registrer deg</RegularButton>}
                        {isSubmitting && (
                            <RegularButton disabled={true}>
                                <ActivityIndicator size="small" color={primary} />
                            </RegularButton>
                        )}

                        <PressableText style={{ paddingVertical: 15 }} onPress={() => {}}>
                            Logg inn på en eksisterende bruker
                        </PressableText>
                    </>
                )}
            </Formik>
        </KeyboardAvoidingContainer>
    </MainContainer>
}

export default Signup
