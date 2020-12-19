const users = []

exports.joinAddUser = ({username, userId, email, socketId, room, avatar})=>{  
  if(!userId) return 
  const findUserIndexWithSId = users.findIndex( user=> user.socketId == socketId)
  const findUserIndexWithUserId = users.findIndex( user=> user.userId == userId)
  const findUserIndexWithRoom = users.findIndex( user=> user.room == room)
  if(findUserIndexWithUserId !== -1 && findUserIndexWithRoom !== -1){
    users[findUserIndexWithUserId].isOnline = true
    users[findUserIndexWithUserId].socketId = socketId
    return { error: null, user: users[findUserIndexWithUserId] }
  }

  users.push({username, socketId, userId, room, avatar, email, isOnline: true}) 
  return { user: {username, socketId, userId, room, avatar, email, isOnline: true}, error: null }

}


exports.leaveUser = (socketId)=>{
  const findUserIndex = users.findIndex( user=> user.socketId == socketId)
  if(findUserIndex !== -1)
    return users.splice(findUserIndex, 1)[0]
}

exports.goOffline = (socketId)=>{
  const findUserIndex = users.findIndex( user=> user.socketId == socketId)
  if(findUserIndex !== -1)
    users[findUserIndex].isOnline = false
    return users[findUserIndex]
}

exports.fetchUser = (socketId)=>{
  return users.find(user=> user.socketId == socketId )
}

exports.fetchUsers = () =>{
  return users
}

exports.fetchFriend = (room, userId) =>{
  for(let i=0; i<users.length; i++){
    if(users[i].room == room && users[i].userId != userId ){
      return users[i]
    }
  }
}


// const arr = [
//   {name: "R", id: 'a'},
//   {name: "A", id: 'b'},
//   {name: "RESR", id: 'a'},
// ]

// let index = arr.findIndex((i)=>{
//   return i.name == "Rj" && i.id == 'a'
// })

// console.log(index);

