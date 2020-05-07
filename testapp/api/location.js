import { endpoint } from '../constants'

export const getLocationData = async () => {
    const url = `${endpoint}/getLocationData`;
    const response = await fetch(url, {
        method: 'GET',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
    return response.json();
}