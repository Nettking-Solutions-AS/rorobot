import React from 'react'

import { colors } from '../../components/colors'


// custom components
import MainContainer from '../../components/Containers/MainContainer'
import BigText from '../../components/Texts/BigText'
import InfoCard from '../../components/Cards/ConnectExchange'

// styled components
import styled from 'styled-components/native'
import { ScreenHeight } from '../../components/shared'
const { darkGray } = colors

const TopBg = styled.View`
    background-color: ${darkGray};
    width: 100%;
    height: ${ScreenHeight * 0.3}px;
    border-radius: 30px;
    position: absolute;
    top: -30px;
`

const Dashboard = () => {
  return (
    <MainContainer style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
      <TopBg />
      <MainContainer style={{ backgroundColor: 'transparent' }}>
        <BigText style={{ marginBottom: 25, fontWeight: 'bold' }}>Koble til en ny børs</BigText>
        <InfoCard style={{ marginBottom: 25 }}/>
      </MainContainer>
    </MainContainer>
  )
}

export default Dashboard