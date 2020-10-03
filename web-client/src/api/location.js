import { setHeader } from '../utlis.js'
import { REST_API } from '../constants'

const getLocationData = async () => {
  const url = `${REST_API}/location/getLocationData`
  const headers = setHeader('GET')
  const response = await fetch(url, headers)
  return response.json()
}

const updateStatus = async (inputData) => {
  const url = `${REST_API}/location/updateStatus`
  const headers = setHeader('POST', inputData)
  const response = await fetch(url, headers)
  return response.json()
}

export {
  updateStatus,
  getLocationData
}