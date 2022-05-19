import React, { useState } from 'react'
import { Formik } from 'formik'
import { ActivityIndicator } from 'react-native'

import { colors } from '../components//colors'

// custom components
import MainContainer from '../components/Containers/MainContainer'
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoidingContainer'
import RegularText from '../components/Texts/RegularText'
import StyledTextInput from '../components/Inputs/StyledTextInput'
import MsgBox from '../components/Texts/MsgBox'
import RegularButton from '../components/Buttons/RegularButton'
import IconHeader from '../components/Icons/IconHeader'
const { primary } = colors

const ForgotPassword = () => {
  const [message, setMessage] = useState('')
  const [isSuccessMessage, setIsSuccessMessage] = useState(false)

  const handleOnSubmit = async (credentials, setSubmitting) => {
    try {
      setMessage(null)

      // call backendered

      // move to next page

      setSubmitting(false)
    } catch (error) {
      setMessage('Forespørsel feilet: ' + error.message)
      setSubmitting(false)
    }
  }

  return <MainContainer>
        <KeyboardAvoidingContainer>
            <IconHeader name='key' style={{marginBottom: 30 }} />
            <RegularText style={{ marginBottom: 25 }}>Skriv inn detaljene under for å starte prosessen</RegularText>

            <Formik
                initialValues={{ email: ''}}
                onSubmit={(values, setSubmitting) => {
                  if (values.email === '') {
                    setMessage('Vennligst fyll inn alle feltene')
                    setSubmitting(false)
                  } else {
                    handleOnSubmit(values, setSubmitting)
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

                        <MsgBox style={{ marginBottom: 25 }} success={isSuccessMessage}>{ message || ' '}</MsgBox>

                        {!isSubmitting && <RegularButton onPress={handleSubmit}>Send inn</RegularButton>}
                        {isSubmitting && (
                            <RegularButton disabled={true}>
                                <ActivityIndicator size="small" color={primary} />
                            </RegularButton>
                        )}
                    </>
                )}
            </Formik>
        </KeyboardAvoidingContainer>
    </MainContainer>
}

export default ForgotPassword
