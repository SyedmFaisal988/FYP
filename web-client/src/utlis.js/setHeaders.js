export const setHeader = (method, body)=>{
    const token = localStorage.getItem('AUTH_TOKEN').replace(/"/g, '')
    return{
        method,
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    }
}