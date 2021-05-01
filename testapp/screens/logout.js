import React, { useEffect } from 'react'
import { AsyncStorage } from 'react-native'
import Loader from '../components/loader'

export default ({ parentProps: { navigation: { dispatch, navigate } } }) => {

    useEffect(()=> {
        AsyncStorage.removeItem('token').then(()=>{
            navigate('unAuthorizeNavigator')
        })
    }, [])
    return null
}