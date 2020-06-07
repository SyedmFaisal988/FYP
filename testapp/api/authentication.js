import { endpoint } from '../constants'
import { setHeader } from '../utils/setHeader'

const logIn = async (inputData) => {
    const url = `${endpoint}/users/login`
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputData)
        })        
        const res = await response.json()
        return res
    }
    catch(err){
        return {
            success: false
        }
    }
}

const check = async ()=>{
    const url = `${endpoint}/users/check`
    const headers = await setHeader('GET')
    const response = await fetch(url, headers)
    return response.json()
}

const signup = async (inputData) => {
    const url = `${endpoint}/users/signup`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData)
    })
    return response.json()
}

export { logIn, check, signup }