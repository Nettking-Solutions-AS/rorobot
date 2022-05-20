/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { ActivityIndicator } from 'react-native'

import { colors } from '../components/colors'

// custom components
import MainContainer from '../components/Containers/MainContainer'
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoidingContainer'
import RegularText from '../components/Texts/RegularText'
import RegularButton from '../components/Buttons/RegularButton'
import IconHeader from '../components/Icons/IconHeader'
import StyledCodeInput from '../components/Inputs/StyledCodeInput'
import ResendTimer from '../components/Timers/ResendTimer'
import MessageModal from '../components/Modals/MessageModal'
const { primary, secondary, lightGray } = colors

const EmailVerification = ({ navigation }) => {
  // code input
  const MAX_CODE_LENGTH = 4
  const [code, setCode] = useState('')
  const [pinReady, setPinReady] = useState(false)

  const [verifying, setVerifying] = useState(false)

  // resending email
  const [activeResend, setActiveResend] = useState(false)
  const [resendStatus, setResendStatus] = useState(' Send på ny')
  const [resendingEmail, setResendingEmail] = useState(false)

  // modal
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessageType, setModalMessageType] = useState('')
  const [headerText, setHeaderText] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [buttonText, setButtonText] = useState('')

  const moveTo = (screen, payload) => {
    navigation.navigate(screen, { ...payload })
  }

  const buttonHandler = () => {
    if (modalMessageType === 'success') {
      // do something - dashboard
      moveTo('Dashboard')
    }

    setModalVisible(false)
  }

  const showModal = (type, headerText, message, buttonText) => {
    setModalMessageType(type)
    setHeaderText(headerText)
    setModalMessage(message)
    setButtonText(buttonText)
    setModalVisible(true)
  }

  const resendEmail = async (triggerTimer) => {
    try {
      setResendingEmail(true)

      // make request to backend
      // update setResendStatus() to "Failed!" or "Sent!"

      setResendingEmail(false)

      // hold on briefly
      setTimeout(() => {
        setResendStatus('Send på ny')
        setActiveResend(false)
        triggerTimer()
      }, 5000)
    } catch (error) {
      setResendingEmail(false)
      setResendStatus('Failed!')
      alert('Utsending av e-post feilet: ' + error.message)
    }
  }

  const handleEmailVerification = async () => {
    try {
      setVerifying(true)

      // call backend

      setVerifying(false)
      return showModal('success', 'Helt fint!', 'Din e-post har blitt bekreftet.', 'Fortsett')
    } catch (error) {
      setVerifying(false)
      return showModal('failed', 'Feilet!', error.message, 'Lukk')
    }
  }

  return <MainContainer>
        <KeyboardAvoidingContainer>
            <IconHeader name="lock-open" style={{ marginBottom: 30 }} />

            <RegularText style={{ textAlign: 'center' }}>
                Skriv inn koden som ble sendt til din e-post
            </RegularText>

            <StyledCodeInput code={code} setCode={setCode} maxLength={MAX_CODE_LENGTH} setPinReady={setPinReady}/>

            {!verifying && pinReady && <RegularButton onPress={handleEmailVerification}>Verifiser</RegularButton>}
            {!verifying && !pinReady && <RegularButton disabled={true} style={{ backgroundColor: secondary }} textStyle={{ color: lightGray }}>Verifiser</RegularButton>}

            {verifying && (
                <RegularButton disabled={true}>
                    <ActivityIndicator size="small" color={primary} />
                </RegularButton>
            )}

            <ResendTimer
                activeResend={activeResend}
                setActiveResend={setActiveResend}
                resendStatus={resendStatus}
                resendingEmail={resendingEmail}
                resendEmail={resendEmail}
            />

            <MessageModal
                modalVisible={modalVisible}
                buttonHandler={buttonHandler}
                type={modalMessageType}
                headerText={headerText}
                message={modalMessage}
                buttonText={buttonText}
            />
        </KeyboardAvoidingContainer>
    </MainContainer>
}

export default EmailVerification
