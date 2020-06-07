import React, { useEffect } from 'react'
import { AsyncStorage } from 'react-native'
import Loader from '../components/loader'

export default ({ parentProps: { navigation: { dispatch, navigate } } }) => {

    useEffect(()=> {
        console.log(dispatch)
        AsyncStorage.clear().then(()=>{
            navigate('unAuthorizeNavigator')
        })
    }, [])
    return (<Loader loading={true} />)
}