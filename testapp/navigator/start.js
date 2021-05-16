import React from 'react'
import { AsyncStorage, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { check } from '../api'
import { StackActions, NavigationActions } from 'react-navigation'

export default Start = (props) => {
    AsyncStorage.getItem("token")
        .then(async (token) => {
            if (token) {
                const response = await check()
                console.log('res', response)
                if (response.success) {
                    await AsyncStorage.setItem('user', JSON.stringify(response.message));
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: "authorizeNavigator", params: {
                            user: response.message
                        } })],
                    })
                    return props.navigation.dispatch(resetAction)
                }
            }
           
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: "unAuthorizeNavigator" })],
            })
            return props.navigation.dispatch(resetAction)
        })
        .catch(err => {
            console.log('err', err)
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: "unAuthorizeNavigator" })],
            })
            return props.navigation.dispatch(resetAction)
        })
    return (
        <LinearGradient
            colors={["#f28800", "#f15e00"]}
            start={[0, 1]}
            end={[1, 0]}
            style={{ flex: 1 }} >
        </LinearGradient>
    )
}