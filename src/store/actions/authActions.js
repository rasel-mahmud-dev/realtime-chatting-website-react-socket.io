import axios from 'axios'  
import api from '../../apis/api'
import { REGISTER, LOGIN, AUTO_LOGIN, LOG_OUT , CHANGE_AVATAR  } from './types'


import InitialSocket from '../../socket/initialSocket'

const backend = 'http://localhost:4002'



export const register = (userData, push)=> async dispatch=>{
  const { data } = await api.post('/auth/register', userData)
  dispatch({type: REGISTER ,  payload: data.user})  
  push(`/`)
}

export const login = (userData, push)=> async (dispatch, getState)=>{
  const { data } = await api.post('/auth/login', userData)

  const { username, _id, email, avatar } = data.currentUser
  let avatarWithLink;
  if(avatar) avatarWithLink = `${backend}/${avatar}`

  dispatch({type: LOGIN,  payload: {
    username, _id, email, avatar: avatarWithLink
  }})

  let { memberInstance }  = getState().chat.socket  
  memberInstance.emitJoinOnline("join", { username, _id, email, avatar: avatarWithLink })     
  push("/")
}


export const autoLogin = (callback)=> async (dispatch, getState)=>{
  const { data } = await api.get('/auth/current-user')  
  if(!data.currentUser){
    return dispatch({type: AUTO_LOGIN, payload: {} })
  }
  const { username, _id, email, avatar, friends } = data.currentUser

  let avatarWithLink;
  if(avatar) avatarWithLink = `${backend}/${avatar}`

  dispatch({type: AUTO_LOGIN,  payload: {
    username, _id, email, avatar: avatarWithLink
  }})
  
  callback( username, _id, email, avatarWithLink)
}

export const logOut= (roomName)=> async (dispatch, getState)=>{
  const { data } = await api.get('/auth/logout')  
  dispatch({type: LOG_OUT,  payload: {}})
  let { rooms }  = getState().chat
  let currentRoom = rooms.find(room=>room.roomName = 'member')
    
  let { memberInstance }  = getState().chat.socket  
  memberInstance.socket.emit('forceDisconnect', currentRoom.roomName)
}


export const changeAvatar = (userData)=> async (dispatch)=>{
  const { data } = await api.post("/user/change-avatar", userData)
  const { username, _id, email, avatar } = data.currentUser
  let avatarWithLink;
  if(avatar) avatarWithLink = `${backend}/${avatar}`
  dispatch({ type: CHANGE_AVATAR,  payload: {
    username, _id, email, avatar: avatarWithLink
  }})
}