import { endpoint } from '../constants'

export const getLocationData = async () => {
    const url = `${endpoint}/location/getLocationData`;
    console.log({url})
    const response = await fetch(url, {
        method: 'GET',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
    return response.json();
}


export const setLocation = async (body) => {
    const url = `${endpoint}/location/setLocationData`;
    const response = await fetch(url,{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    return response.json()
}