import { combineReducers } from 'redux'

import {
  LOGIN,
  REGISTER,
  AUTO_LOGIN,
  LOG_OUT,
  CHANGE_AVATAR,
  
  STORE_SOCKET,
  STORE_ONLINE_USERS,
  SET_OFFLINE_USER,
  SET_ONLINE_USER,
  
  FETCH_USERS,
  FETCH_FRIENDS,
  
  PUSH_NOTIFICATION
} from '../actions/types'



function authReducer(state={}, action){
  switch(action.type){
    case LOGIN:
      return action.payload

    case REGISTER:
      return action.payload

    case LOG_OUT :
      return action.payload

    case AUTO_LOGIN:    
      return action.payload  

    case CHANGE_AVATAR:
      return action.payload
    
    case FETCH_FRIENDS:
      return {...state, friends: action.payload}

    default: 
      return state  
  }
}

let initialChat = {
  rooms: [
    // { roomName: '', members: [] }
  ]
}

function chatReducer(state = initialChat, action){
  let updatedState = {...state }
  switch(action.type){
    
    case STORE_ONLINE_USERS:      
        let existRoomIndex = updatedState.rooms.findIndex(room => room.roomName == action.payload.roomName  )
        if(existRoomIndex !== -1){
          updatedState.rooms[existRoomIndex] = action.payload
        } else {
          updatedState.rooms.push(action.payload)
        }
        return updatedState

    case SET_ONLINE_USER:
      
      let findIndex = updatedState.onlineUsers.findIndex(user=> user.userId == action.payload.userId)
      updatedState.onlineUsers[findIndex].isOnline = true   
      return updatedState  
      
      case SET_OFFLINE_USER:
      console.log(action.payload);
      return {...state, rooms: action.payload }  

    default:
      return state
  }
}

function userReducer(state= [], action){
  switch (action.type){
    case FETCH_USERS :
      return action.payload
    
    default:
      return state
  }
}

let initialNotificationsDummy = {
  userId: "",             // * your notification....
  messages: [{
    title: "new message",  // * notification title when it popup
    isRead: false,         // * initially read false
    text: "text",
    sender: { avatar: "pic", username: "F", _id: "senderId" },    // ! "who send you",
    createdAt: "when you recieved it"
  }]
}

let initialNotifications = {
  // userId: "234234",             // * your notification....
  // messages: [{
  //   title: "new message",  // * notification title when it popup
  //   isRead: false,         // * initially read false
  //   text: "text",
  //   sender: { avatar: "images/avatar/avatar_icon_20200412_1306386_20201215_1231293.jpg", username: "F", _id: "senderId" },    // ! "who send you",
  //   createdAt: "when you recieved it"
  // }]
}

function notificationReducers(state= initialNotifications, action){
  let oldState = {...state}
  switch (action.type){
    case PUSH_NOTIFICATION :
        if(oldState.userId === action.payload.userId._id){
          oldState.messages.push(action.payload.message)
        } else {
          oldState.userId = action.payload.userId._id
          oldState.messages = [action.payload.message]
        }
      return oldState
    
    default:
      return state
  }
}


export default combineReducers({
  auth: authReducer,
  chat: chatReducer,
  users: userReducer,
  notification: notificationReducers
})