
const mongoose = require('mongoose')
const User = mongoose.model('User')

const changeAvatar = require('../tools/changeAvatar')
const deleteFile = require('../tools/deleteFile')

module.exports = app => {
  app.post("/user/change-avatar", (req, res, next) => {
    const path = 'images/avatar'
    const types = ['jpg', 'jpeg', 'png']
    let oldAvatar = req.user.avatar ? req.user.avatar : undefined
    changeAvatar(path, types, 'avatar')(req, res, (err)=>{
      if(err) return console.log(err)
      User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: req.file.path } },
        { new: true }
      ).exec((err, doc)=>{
        if(err) return console.log(err)
        if(req.user.avatar) {
          deleteFile(oldAvatar, (err, result)=>{
            if(err) console.log(err);
          })
        }
        res.status(200).json({ currentUser: doc, message: 'Phofile Photo Changed.' })
      })
    })
    
  });
  
  app.get("/api/fetch-users", async (req, res) => {
    let users = await User.find().select("_id username avatar friends")
    res.json({users})
  });
  
  
  app.post("/api/add-friend", async (req, res)=>{
    if(!req.user._id) {
      return res.json({message: "not Authorization"})
    }
    const {friendId} = req.body
    
    let user = await User.findById(req.user._id)
    // let fId = mongoose.Types.ObjectId(friendId)
    if(!user.friends){
      user.friends = [friendId]
    } else {
      let alreadyFriend = user.friends.findIndex(u=>u === friendId )
      if(alreadyFriend === -1){
        user.friends.push(friendId)
      }
    }
    user = await user.save()
    
    let friend = await User.findById(friendId)
    if(!friend.friends){
      friend.friends = [ user._id.toString() ]
    } else {
      let alreadyFriendFriends = friend.friends.findIndex(u=>u === user._id )
      if(alreadyFriendFriends === -1){
        friend.friends.push(user._id.toString())
      }
    }
    friend = await friend.save()
    res.json({user})
  })
  
  app.post("/api/remove-friend", async (req, res)=>{
    if(!req.user._id) {
      return res.json({message: "not Authorization"})
    }
    const {friendId} = req.body
    let fId = friendId
    let user = await User.findById(req.user._id)
    let alreadyFriend = user.friends.findIndex(u=> u ===  fId )
    if(alreadyFriend !== -1){
      user.friends.splice(alreadyFriend, 1)
    }
    user = await user.save()

    let friend = await User.findById(friendId)
    let alreadyFriendFriends = friend.friends.findIndex(u=>u == user._id )
    if(alreadyFriendFriends !== -1){
      friend.friends.splice(alreadyFriendFriends, 1)
    }
    await friend.save()
    res.json({user})
  })
  
  app.get("/api/fetch-my-friend", async (req, res)=>{
    const { type } = req.query
    if(!req.user) {
      return res.json({message: "not Authorization"})
    }
    if(type === "populate"){
      let user = await User.findOne(req.user._id).select("friends").populate("friends", "username avatar")
      res.json({friends: user.friends })
    } else{
      let user = await User.findOne(req.user._id).select("friends")
      res.json({friends: user.friends })
    }

   
  })
  
};

