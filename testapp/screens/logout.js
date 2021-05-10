import { logout } from '../api';
import Loader from '../components/loader';
import { Alert, AsyncStorage } from 'react-native';
import React, { useEffect, useState } from 'react';

export default ({ parentProps: { navigation: { dispatch, navigate, pop } } }) => {
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        logout().then((resp) => {
            if (resp.success) {
                AsyncStorage.removeItem('token').then(()=>{
                    setLoading(false)
                    navigate('unAuthorizeNavigator')
                })
            } else {
                throw "";
            }
        }).catch(() => {
            setLoading(false)
            Alert.alert('Something went wrong');
        })
    }, [])
    return <Loader loading={loading} />
}