import axios from 'axios'  
import api from '../../apis/api'

import {  STORE_ONLINE_USERS, SET_ONLINE_USER, SET_OFFLINE_USER  } from './types'

export const storeUsers = (users=[])=> (dispatch, getState) =>{
  // console.log("initia users", users);
  
  let oldUsers = getState().chat

  for(let i=0; i<users.length; i++){
    users[i].isOnline = true
  }

  let all =  [...oldUsers, ...users]

  let mymap = new Map(); 

    let unique = all.filter(el => { 
      const value = mymap.get(el.username);   
      if(value) { 
          if(el.userId === value) { 
             return false
          } else { 
            mymap.delete(el.username); 
            mymap.set(el.username, el.userId); 
            return true; 
          } 
      } 
      mymap.set(el.username, el.userId); 
      return true; 
    }); 

  dispatch({
    type: STORE_ONLINE_USERS,
    payload: unique
  })
} 

export const storeOnlineUsers = (room) =>{
  return {
    type: STORE_ONLINE_USERS,
    payload: room
  }
} 

export const leaveRoom=(leaveRoomUser)=>(dispatch, getState)=>{
  let rooms = getState().chat.rooms
  let userInRoomIndex = rooms.findIndex( room => room.roomName == leaveRoomUser.roomName)

  let currentRoom = rooms[userInRoomIndex]   // obj
  
  let currentUserIndex = currentRoom.members.findIndex(user=> user.userId._id == leaveRoomUser.userId )
  // console.log(currentUserIndex);
  
  if(currentUserIndex !== -1){
    currentRoom.members[currentUserIndex].isInRoom = false
    currentRoom.members[currentUserIndex].fffffffffffffff = false
  }
  // console.log(rooms);
  
  
  dispatch({
    type: SET_OFFLINE_USER,
    payload: rooms
  })
}

export const onlineUser = (onlineUser)=> {
  return {
    type: SET_ONLINE_USER,
    payload: onlineUser
  }
} 

export const offlineUser = (offlineUser)=> {  
  return {
    type: SET_OFFLINE_USER,
    payload: offlineUser
  }
} 
