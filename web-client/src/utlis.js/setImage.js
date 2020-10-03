import { REST_API } from '../constants'

export const getImage = (image) => `${REST_API}/images/${image}`;