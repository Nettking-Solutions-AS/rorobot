import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import firebase from '../../firebase/Config'
import { useGlobalState } from '../StateManagement/GlobalState'

import ProfileModal from '../Modals/ProfileModal'

// styled components
import styled from 'styled-components/native'
import { colors } from '../colors'
const { primary, secondary, accent } = colors

const StyledView = styled.TouchableOpacity`
    background-color: ${primary};
    flex-direction: column;
    height: 45px;
    width: 45px;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    border-width: 2px;
    border-color: ${secondary};
`

const Avatar = (props, navigation) => {
  // modal
  const [modalVisible, setModalVisible] = useState(false)
  const [headerText, setHeaderText] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  const moveTo = (screen, payload) => {
    navigation.navigate(screen, { ...payload })
  }

  const { state, dispatch } = useGlobalState()

  const onLogout = async () => {
    setLoggingOut(true)

    // clear user credentials
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: 'SET_CURRENT_USER', payload: null })
      })
      .catch((error) => {
        alert(error)
      })

    setLoggingOut(false)
    setModalVisible(false)

    // move to Login
    moveTo('Login')
  }

  const showProfileModal = (user) => {
    setHeaderText(user)
    setModalVisible(true)
  }

  const hideModal = () => {
    setModalVisible(false)
  }

  const onAvatarPress = () => {
    showProfileModal(state.currentUser?.name)
  }

  return (
      <>
        <StyledView onPress={onAvatarPress} style={props.imgContainerStyle}>
            <MaterialCommunityIcons
                name='account'
                size={35}
                color={accent}
            />
        </StyledView>
        <ProfileModal
            modalVisible={modalVisible}
            headerText={headerText}
            buttonHandler={onLogout}
            loggingOut={loggingOut}
            hideModal={hideModal}
        />
      </>
  )
}

export default Avatar
