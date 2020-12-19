const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require('cors')
const SocketIO = require('socket.io')
const passport = require('passport')
const cookieSession = require('cookie-session')
const expressSession = require('express-session')

// keys
const keys = require("./config/keys");

// model........
require("./models/User");
require('./models/Chat')
require('./models/Room')
require('./models/Message')

// passport initial............
require('./passport/passportLocal')

const app = express();

app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// cors..............
const allAllowedOrigin = [keys.FRONTEND] // like http://localhost:3000
app.use(cors({
    credentials: true,
    origin: (origin, callback)=>{
      callback(null, true) // accept all origin  
      // if(allAllowedOrigin.includes(origin)){
      //   callback(null, true)
      // } else{
      //   callback(new Error(`Origin: ${origin} is not allowed`))
      // }
    } 
}))

app.use(cookieSession({
  name:"app_name",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  keys: [keys.COOKIE_SECRET]
}))

// ! or
// app.use(expressSession({
//   resave: true,
//   saveUninitialized: true,
//   secret: "Secret"
// }))



// passport session and initialize..................
app.use(passport.initialize())

// Set logged user obj inside req obj .................
app.use(passport.session())


// app.use("/", (req, res, next)=>{
//   res.send("DSFg")
// })


const { joinAddUser, leaveUser, fetchUser, fetchUsers, goOffline, fetchFriend } = require('./messageDB')

const { getUser, removeUser, addUser, getUsers } = require('./User')



const Message = mongoose.model('Message')
const Room = mongoose.model('Room')
const User = mongoose.model('User')


// routes
require('./routes/authRoutes')(app)
require('./routes/userRoutes')(app)
require('./routes/chatRouter')(app)


app.get('/fetch-users', (req, res, next)=>{
  User.find().then(doc=>{
    res.send(doc)
  })
})

app.get('/fetch-rooms', (req, res, next)=>{
  Room.find()
  .populate('userId', 'username avatar')
  .then(doc=>{
    res.send(doc)
  })
})

app.get('/chat-users', (req, res, next)=>{
  res.send(getUsers())
})
app.get('/chat-message', (req, res, next)=>{
  res.send(fetchUsers())
})

// class OnlineUser{
//   constructor(){
//     this.users = []
//   }

//   addUser(user){
//     let checkUserExist = this.users.findIndex((user)=> user._id == user._id )
//     if(checkUserExist != -1){
//       return { user: null , error: "User Already Online" }
//     }
//     this.users.push(user)
//     console.log( this.users);
    
//     return { user, error: null}
//   }


//   removeUser(socketId){
//     let checkUser = this.users.findIndex((user)=> user.socketId == socketId )
//     if(checkUser !== -1){
//       return { error: "User Not Found"}
//     }
//     this.users.splice(checkUser, 1)
//   }

//   getUsers(){
//     return this.users
//   }

// }

app.get("/api/fetch_roomm",async (req, res)=>{
  let r = await Room.findOne({roomName: "0001122223344455555566788889999aabbccccdddeeefff"})
      .populate({ path: "group.id", modal: "User", select: "avatar username" })
  console.log(r)
  // res.send(r)
})



const server = http.createServer(app);
const io = new SocketIO(server)



// let users = new OnlineUser()

io.on('connection', (socket)=>{

  // * join member room who are register our app
  socket.on("join", async ({ username, _id, email, avatar })=>{
    let existRoom = await Room.findOne({roomName: "member"})
    // console.log(existRoom);
    if(existRoom){
      let existMemberIndex = existRoom.members.findIndex(member=> member.userId == _id)      
      if(existMemberIndex !== -1){
        existRoom.members[existMemberIndex].socketId = socket.id
        existRoom.members[existMemberIndex].isInRoom = true
      } else{
        existRoom.members.push({ userId: _id, socketId: socket.id, isInRoom: true })        
      }
      existRoom = await existRoom.save()
      socket.join("member")

      let room = await Room.findOne({roomName: "member"}).populate('members.userId', 'username avatar')

      socket.emit('getOnlineUser', room)
      socket.broadcast.to(room.roomName).emit('getOnlineUser', room)

    } else {      
      let newRoom = new Room({
        roomName: "member",
        members: [{ userId: _id, socketId: socket.id, isInRoom: true }]        
      })
      newRoom = await newRoom.save()
      socket.join("member")
      let room = await Room.findOne({roomName: "member"}).populate('members.userId', 'username avatar')   
      socket.emit('getOnlineUser', room)
      socket.broadcast.to(newRoom.roomName).emit('getOnlineUser', room)
    }
  })
  
  socket.on('forceDisconnect', async (roomName)=>{
    let currentRoom = await Room.findOne({roomName}) 
    let roomInUserIndex = currentRoom.members.findIndex(member => member.socketId == socket.id )

    currentRoom.members[roomInUserIndex].isInRoom = false
    let leaveRoomUser = await currentRoom.save()
  
    socket.emit('forceDisconnect',  { userId: currentRoom.members[roomInUserIndex].userId,  roomName})
    socket.broadcast.to(currentRoom.roomName).emit("forceDisconnect", { userId: currentRoom.members[roomInUserIndex].userId,  roomName})

    // socket.disconnect() // stop forever remove current socket. unless server reload it wont'work
  })

  socket.on('disconnect', async (reason) => {
    console.log("disconnect");
    
    const rooms = await Room.find()
    let roomName;
    for(let i=0; i<rooms.length; i++){
      for(j=0; j<rooms[i].members.length; j++){
        if(rooms[i].members[j].socketId == socket.id ){
          roomName = rooms[i].roomName
          break;
        }
      }
    }
    
    let leaveRoom = await Room.findOne({roomName: roomName})
  
    const leaveRoomUserIndex = leaveRoom && leaveRoom.members.findIndex(member=>member.socketId == socket.id )
    if(leaveRoomUserIndex !== -1 && leaveRoomUserIndex !== null){
      leaveRoom.members[leaveRoomUserIndex].isInRoom = false
      leaveRoom = await leaveRoom.save()

      socket.emit('leaveOnlineUser', { userId: leaveRoom.members[leaveRoomUserIndex].userId, roomName: leaveRoom.roomName })
      socket.broadcast.to(leaveRoom.roomName).emit("leaveOnlineUser", { userId: leaveRoom.members[leaveRoomUserIndex].userId, roomName: leaveRoom.roomName })
    }
    
    // if(getUser(socket.id)){      
    //   const user = removeUser(socket.id)      
    //   console.log("user Left " , user.username);
    //   socket.emit('leaveOnlineUser', getUsers())
    //   socket.broadcast.to("online").emit("leaveOnlineUser", getUsers())
    // } 
  })
  
  
  
  // * create onToOneChat room..............
  socket.on('onToOneRoom', async (roomData)=>{
    const roomName = createRoomName(roomData.roomName)
    let findRoom = await Room.findOne({ roomName: roomName})
    
    //> get preload messages and send to client.
    let messages = await Message.find({ roomName: roomName })
    
    let user = await User.findOne({_id: roomData.friendId})
    let currentFriend = {_id: user._id, username: user.username, avatar: user.avatar, isInRoom: false, roomName }
    
    if(findRoom){
      let myIdIndex = findRoom.group.findIndex(i=>i.id == roomData.userId )
      findRoom.group[myIdIndex].isInRoom = true
      findRoom.socketId = socket.id
      findRoom.isInRoom = true
      currentFriend.isInRoom = findRoom.group[findRoom.group.findIndex(i=>i.id == roomData.friendId )].isInRoom
      socket.join(roomName)
      findRoom = await findRoom.save()
      let rooms = await Room.findOne({roomName: roomName}).populate("group.id", "username avatar")
      socket.emit('onToOneRoom', { currentFriend, messages, rooms } )
      // socket.broadcast.to(roomName).emit('onToOneRoom',  { currentFriend, messages, rooms } )
    } else {
      let newRoom = new Room({
        roomName: roomName,
        group: [{id: roomData.userId, isInRoom: true}, {id: roomData.friendId, isInRoom: false}],
      })
      currentFriend.isInRoom = false
      socket.join(roomName)
      newRoom = await newRoom.save()
      let rooms = await Room.find({ roomName: roomName })
      socket.emit('onToOneRoom', { currentFriend, messages, rooms } )
      // socket.broadcast.to(roomName).emit('onToOneRoom', { currentFriend, messages, rooms } )
    }
  })
  
  //? when current user switch another room then set each onToOneRoom   =   isInRoom : false or true
  socket.on("LeaveOnToOneRoom", async({friendId, userId, roomName})=>{
    let room = await Room.findOne({ roomName })
    if (room){
      let i = room.group.findIndex(i=>i.id == userId )
      room.group[i].isInRoom = false
      await room.save()
    }
  })
  
  
  // * send message and notification message
  socket.on('onToOneRoomMessage', async ({text, roomName, userId, sender}) => {
    let message = await Message.findOne({ roomName })
    let newMessage = {
      text,
      userId : userId._id,
      sender: sender,
      createdAt: Date.now()
    }
    if(message){
      message.messages.push(newMessage)
    } else {
      message = new Message({roomName, messages: [newMessage]})
    }
    message = await message.save()
    let lastMessage = {roomName: message.roomName, message: newMessage }
    socket.emit('onToOneRoomMessage', lastMessage)
    socket.broadcast.to(roomName).emit('onToOneRoomMessage', lastMessage)
  
  
    // * pushNotification who are not active in room
    let room = await Room.findOne({ roomName: "member"})
    
    let friends = room.members.filter(item=>item.userId == userId._id )
    
    // * look your patner is active or not oneToOne group if he not then send notification him.
    let room2= await Room.findOne({ roomName})
    let friendsIndex = room2.group.findIndex(i=>i.id == userId._id )
    
    if(!room2.group[friendsIndex].isInRoom) {
      let notifyMessage = {
        userId: userId,           // * "whom you send notification",
        message: {
          title: "new message",
          isRead: false,
          text: text,
          userId: userId._id,
          sender: {
            avatar: "images/avatar/avatar_icon_20200412_1306386_20201215_1231293.jpg",
            username: "F",
            _id: "senderId"
          },    // ! "who send you",
          createdAt: Date.now()
        }
      }

      socket.broadcast.to(friends[0].socketId).emit('get_notification_private_chat', notifyMessage)
    }
  })
  
  
  // * live delete recent message both person....
  socket.on("onToOneRoomDeleteMessage", async ({roomName, messageId})=>{
    let message = await Message.findOne({ roomName })
    if(message){
      let index = -1
      for (let i=0; i<message.messages.length; i++){
        if(message.messages[i]._id == messageId){
           index = i
          break;
        }
      }
      if(index !== -1){
        message.messages.splice(index, 1)
      }
      
      await message.save()
      socket.emit("onToOneRoomDeleteMessage", {roomName, messageId})
      socket.broadcast.to(roomName).emit('onToOneRoomDeleteMessage', {roomName, messageId})
    }
  })

  

  socket.on('disconnect', async (reason) => {
    let u = fetchUser(socket.id);
    let currentRoom = await Room.findOne({ socketId: socket.id })

    if(currentRoom){
      currentRoom.isInRoom = false,
      currentRoom = await currentRoom.save()
      socket.broadcast.to(currentRoom.roomName).emit("leaveChat", currentRoom )
      // socket.emit('leaveChat',  currentRoom)
    }


    // if(u){      
    //   let offlineUser = goOffline(socket.id)
    //   socket.broadcast.to(u.room).emit("leaveChat",  { 
    //     username: u.username, 
    //     text: `${u && u.username} has left`, 
    //     chatFriends: fetchUsers(),
    //     room: offlineUser
    //   })
    //    socket.emit('leaveChat',  { 
    //     username: u.username, 
    //     text: `${u && u.username} has left`, 
    //     chatFriends: fetchUsers(),
    //     room: offlineUser
    //   })
    // }
  })



});

function createRoomName(room){
  let roomArr = room.split("")
  let d = roomArr.sort((a, b)=>{
    let aa = a.toLowerCase()
    let bb = b.toLowerCase()
    if(aa > bb){
      return 1
    } else if(aa < bb){
      return -1
    } else{
      return 0
    }
  })
  return d.join('').trim()
}


server.listen(keys.PORT, err =>console.info(`server is running on port http://localhost:${keys.PORT}`))
mongoose
  .connect(keys.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(res => console.info("Database Connected."))
  .catch(err => console.info("Database Connection Fail."));

