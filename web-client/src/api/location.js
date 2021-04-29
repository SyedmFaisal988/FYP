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

const getCrowdData = async () => {
  const url = `${REST_API}/location/getCrowdData`
  const headers = setHeader('GET')
  const response = await fetch(url, headers)
  return response.json()
}

const getDashboardData = async () => {
  const url = `${REST_API}/location/getDashboardData`
  const headers = setHeader('GET')
  const response = await fetch(url, headers)
  return response.json()
}
 
export {
  updateStatus,
  getLocationData,
  getCrowdData,
  getDashboardData
}