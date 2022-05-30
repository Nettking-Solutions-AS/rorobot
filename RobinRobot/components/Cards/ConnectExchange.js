/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/prop-types */
import React from 'react'
import { FormControl, Stack, Text, Input, Select, CheckIcon, WarningOutlineIcon } from "native-base";

// styled components
import styled from 'styled-components/native'
import { ScreenHeight } from '../shared'
import { colors } from '../colors'
import ConnectButton from "../Buttons/Connect";
const { primary, secondary, black } = colors

const CardView = styled.View`
    flex-direction: row;
    height: ${ScreenHeight * 0.43}px;
    background-color: ${primary};
    border-width: 2px;
    border-color: ${secondary};
    padding: 20px;
    border-radius: 15px;
    overflow: hidden;
    elevation: 5;
    shadow-color: ${black};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
`

const CardSection = styled.View`
    justify-content: space-between;
    align-items: flex-start;
`

const ConnectExchange = ({ ...props }) => {
  const [exchange, setExchange] = React.useState('');

  return (
  <CardView style={{ ...props?.style }}>
      <CardSection style={{ width: '60%' }}>
        <FormControl 
          w='3/4' 
          maxW='330' 
          isRequired
        >
          <Stack space={1} w="75%" maxW="330px">
            <FormControl.Label>
              <Text bold>Velg børs</Text>
            </FormControl.Label>
            <Select 
              selectedValue={exchange} 
              minWidth="330" 
              accessibilityLabel="Velg børs" 
              placeholder="Velg børs" 
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} 
              onValueChange={itemValue => setExchange(itemValue)}>
              <Select.Item label="Binance" value="Binance" />
              <Select.Item label="Coinbase" value="Coinbase" />
            </Select>

            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Du må velge en børs!
            </FormControl.ErrorMessage>

            <FormControl.Label>
              <Text bold>Navn</Text>
            </FormControl.Label>
            <Input placeholder={exchange} value={exchange} minWidth="330px" />

            <FormControl.Label>
              <Text bold>API nøkkel</Text>
            </FormControl.Label>
            <Input minWidth="330px" />

            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Du må skrive inn API nøkkel!
            </FormControl.ErrorMessage>

            <FormControl.Label>
              <Text bold>API hemmelig</Text>
            </FormControl.Label>
            <Input minWidth="330px" />

            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Du må skrive inn hemmelig API nøkkel!
            </FormControl.ErrorMessage>

            <ConnectButton>
              Koble til
            </ConnectButton>
          </Stack>
        </FormControl>
      </CardSection>
  </CardView>
  )
}

export default ConnectExchange
