import { endpoint } from '../constants'
import { setHeader } from '../utils/setHeader'

export const uploadImage = async (body) => {
    const url = `${endpoint}/location/uploads`;
    const headers = await setHeader('POST', { body: JSON.stringify(body) })
    try{
        const response = await fetch(url, headers)
        return 
    }
   catch(err){
       console.log(err)
   }
}

export const setComplaint = async (body) => {
    const url = `${endpoint}/location/setComplaint`;
    const headers = await setHeader('POST', { body: JSON.stringify(body) })
    try{
        const response = await (await fetch(url, headers)).json()
        return response.status === 200
    }
   catch(err){
       console.log(err)
   }
}