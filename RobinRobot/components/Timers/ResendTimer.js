/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'

// styled components
import styled from 'styled-components/native'
import { colors } from '../colors'
import SmallText from '../Texts/SmallText'
import PressableText from '../Texts/PressableText'
import RowContainer from '../Containers/RowContainer'
const { accent, success, fail } = colors

const StyledView = styled.View`
    align-items: center;
`

const ResendText = styled(SmallText)`
    color: ${accent};
    ${(props) => {
        const { resendStatus } = props
        if (resendStatus === 'Failed!') {
            return `color: ${fail}`
        } else if (resendStatus === 'Sent!') {
            return `color: ${success}`
        }
    }}
`

const ResendTimer = ({ activeResend, setActiveResend, targetTimeInSeconds, resendEmail, resendStatus, ...props }) => {
  const [timeLeft, setTimeLeft] = useState(null)
  const [targetTime, setTargetTime] = useState(null)

  let resendTimerInterval

  const triggerTimer = (targetTimeInSeconds = 30) => {
    setTargetTime(targetTimeInSeconds)
    setActiveResend(false)
    const finalTime = +new Date() + targetTimeInSeconds * 1000
    resendTimerInterval = setInterval(() => calculateTimeLeft(finalTime), 1000)
  }

  const calculateTimeLeft = (finalTime) => {
    const difference = finalTime - +new Date()
    if (difference >= 0) {
      setTimeLeft(Math.round(difference / 1000))
    } else {
      clearInterval(resendTimerInterval)
      setActiveResend(true)
      setTimeLeft(null)
    }
  }

  useEffect(() => {
    triggerTimer(targetTimeInSeconds)

    return () => {
      clearInterval(resendTimerInterval)
    }
  }, [])

  return (
        <StyledView {...props}>
            <RowContainer>
                <SmallText>Mottok du ikke e-posten?</SmallText>
                <PressableText
                    onPress={() => resendEmail(triggerTimer)}
                    disabled={!activeResend}
                    style={{ opacity: !activeResend ? 0.65 : 1 }}
                >
                    <ResendText resendStatus={resendStatus}>{resendStatus}</ResendText>
                </PressableText>
            </RowContainer>

            {!activeResend && (
                <SmallText>
                    om <SmallText style={{ fontWeight: 'bold' }}>{timeLeft || targetTime}</SmallText> sekund(er)
                </SmallText>
            )}
        </StyledView>
  )
}

export default ResendTimer