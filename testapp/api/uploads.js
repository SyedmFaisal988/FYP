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