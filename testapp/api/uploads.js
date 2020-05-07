import { endpoint } from '../constants'

export const uploadImage = async (body) => {
    const url = `${endpoint}/uploads`;
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        return 
    }
   catch(err){
       console.log(err)
   }
}