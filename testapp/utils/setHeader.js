import { AsyncStorage } from "react-native"

export const setHeader = async (method, body)=>{
    const token = (await AsyncStorage.getItem('token')).replace(/"/g, '')
    return{
        method,
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        ...body
    }
}