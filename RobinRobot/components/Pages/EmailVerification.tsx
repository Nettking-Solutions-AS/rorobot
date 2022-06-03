import React, { useState } from 'react'
import { ActivityIndicator } from 'react-native'

import { colors } from '../colors'

// custom components
import MainContainer from '../Containers/MainContainer'
import KeyboardAvoidingContainer from '../Containers/KeyboardAvoidingContainer'
import RegularText from '../Texts/RegularText'
import RegularButton from '../Buttons/RegularButton'
import IconHeader from '../Icons/IconHeader'
import StyledCodeInput from '../Inputs/StyledCodeInput'
import ResendTimer from '../Timers/ResendTimer'
import MessageModal from '../Modals/MessageModal'
const { primary, secondary, lightGray } = colors

const EmailVerification = ({ navigation }) => {
  // code input
  const MAX_CODE_LENGTH = 4
  const [code, setCode] = useState('')
  const [pinReady, setPinReady] = useState(false)

  const [verifying, setVerifying] = useState(false)

  // resending email
  const [activeResend, setActiveResend] = useState(false)
  const [resendStatus, setResendStatus] = useState(' Resend')
  const [resendingEmail, setResendingEmail] = useState(false)

  // modal
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessageType, setModalMessageType] = useState('')
  const [headerText, setHeaderText] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [buttonText, setButtonText] = useState('')

  const buttonHandler = () => {
    if (modalMessageType === 'success') {
      navigation.navigate('Dashboard')
    }

    setModalVisible(false)
  }

  const showModal = (type: React.SetStateAction<string>, headerText: React.SetStateAction<string>, message: React.SetStateAction<string>, buttonText: React.SetStateAction<string>) => {
    setModalMessageType(type)
    setHeaderText(headerText)
    setModalMessage(message)
    setButtonText(buttonText)
    setModalVisible(true)
  }

  const resendEmail = async (triggerTimer: () => void) => {
    try {
      setResendingEmail(true)

      // make request to backend
      // update setResendStatus() to "Failed!" or "Sent!"

      setResendingEmail(false)

      // hold on briefly
      setTimeout(() => {
        setResendStatus('Resend')
        setActiveResend(false)
        triggerTimer()
      }, 5000)
    } catch (error) {
      setResendingEmail(false)
      setResendStatus('Failed!')
      alert('Sending of email failed: ' + error.message)
    }
  }

  const handleEmailVerification = async () => {
    try {
      setVerifying(true)

      // call backend

      setVerifying(false)
      return showModal('success', 'Perfect!', 'Your email has been verified.', 'Continue')
    } catch (error) {
      setVerifying(false)
      return showModal('failed', 'Failed!', error.message, 'Close')
    }
  }

  return <MainContainer>
        <KeyboardAvoidingContainer>
            <IconHeader name="lock-open" style={{ marginBottom: 30 }} color={undefined} />

            <RegularText style={{ textAlign: 'center' }}>
                Fill in the code sent to your email
            </RegularText>

            <StyledCodeInput code={code} setCode={setCode} maxLength={MAX_CODE_LENGTH} setPinReady={setPinReady}/>

            {!verifying && pinReady && <RegularButton onPress={handleEmailVerification}>Verify</RegularButton>}
            {!verifying && !pinReady && <RegularButton disabled={true} style={{ backgroundColor: secondary }} textStyle={{ color: lightGray }}>Verify</RegularButton>}

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
              resendEmail={resendEmail} targetTimeInSeconds={undefined}            
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
