


const users = []

exports.addUser = ({username, userId, email, socketId, room, avatar})=>{  
  if(!userId) return 
  const findUserIndexWithSId = users.findIndex( user=> user.socketId == socketId)
  const findUserIndexWithUserId = users.findIndex( user=> user.userId == userId)
  const findUserIndexWithRoom = users.findIndex( user=> user.room == room)
  if(findUserIndexWithUserId !== -1 && findUserIndexWithRoom !== -1){
    return { error: 'user already taken', user: null }
  }

  users.push({username, socketId, userId, room, avatar, email}) 
  return { user : {username, socketId, userId, room, avatar, email}, error: null }

}


exports.removeUser = (socketId)=>{
  const findUserIndex = users.findIndex( user=> user.socketId == socketId)
  if(findUserIndex !== -1)
    return users.splice(findUserIndex, 1)[0]
}

exports.getUser = (socketId)=>{
  return users.find(user=> user.socketId == socketId )
}

exports.getUsers = () =>{
  return users
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
