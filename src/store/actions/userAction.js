import {FETCH_USERS, FETCH_FRIENDS} from "./types";

import api  from "../../apis/api"

export const fetchUsers = () => async (dispatch)=>{
  let {data} = await api.get("/api/fetch-users")
  if(data.users) {
    dispatch({
      type: FETCH_USERS,
      payload: data.users
    })
  }
  
}
export const addFriend = (friendId) => async (dispatch)=>{
  let { data } = await api.post("/api/add-friend", {friendId})
  console.log(data)
  
}
export const removeFriend = (friendId) => async (dispatch)=>{
  let { data } = await api.post("/api/remove-friend", {friendId})
}



export const fetchFriends = (type) => async (dispatch)=>{
  let { data } = await api.get(`/api/fetch-my-friend/?type=${type}`)
  if(data.friends){
    dispatch({
      type: FETCH_FRIENDS,
      payload: data.friends
    })
  }
}