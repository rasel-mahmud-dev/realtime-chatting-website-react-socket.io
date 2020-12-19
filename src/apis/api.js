import axios from 'axios'

import io from "socket.io-client"

export const baseUri = "http://localhost:4002"
export default axios.create({
  baseURL : baseUri,
  withCredentials: true,
})


export const socket = new io(baseUri)
