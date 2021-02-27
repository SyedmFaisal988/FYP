import { endpoint } from '../constants'
import { setHeader } from '../utils/setHeader'

export const setMaintaince = async (body) => {
    const url = `${endpoint}/maintaince/setMaintaince`;
    const headers = await setHeader("POST", { body: JSON.stringify(body) });
    const response = await fetch(url, headers)
    return response.json();
}
