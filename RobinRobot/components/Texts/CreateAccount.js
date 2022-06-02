/* eslint-disable react/prop-types */
import React from 'react'

// styled components
import styled from 'styled-components/native'
import { colors } from '../colors'
import SmallText from '../Texts/SmallText'
const { accent } = colors

const StyledPressable = styled.Pressable`
`

const CreateAccount = (props) => {
  return (
    <StyledPressable onPress={props.onPress} {...props}>
        <SmallText style={{ color: accent }}>{props.children}</SmallText>
    </StyledPressable>
  )
}

export default CreateAccount