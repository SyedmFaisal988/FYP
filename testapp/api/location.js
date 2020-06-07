import { endpoint } from '../constants'
import { setHeader } from '../utils/setHeader'

export const getLocationData = async () => {
    const url = `${endpoint}/location/getLocationData`;
    const headers = await setHeader("GET")
    const response = await fetch(url, headers)
    return response.json();
}


export const setLocation = async (body) => {
    const url = `${endpoint}/location/setLocationData`;
    const headers = await setHeader('POST', { body: JSON.stringify(body) })
    const response = await fetch(url,headers)
    return response.json()
}