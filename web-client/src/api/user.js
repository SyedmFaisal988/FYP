import { setHeader } from '../utlis.js'
import { REST_API } from '../constants'

export const adminLogin = async (inputData) => {
    const url = `${REST_API}/users/login-admin`
    const headers = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData)
    }
    const response = await fetch(url, headers)
    return response.json()
}