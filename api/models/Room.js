const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  // group: [],
  group: [{
    _id:false,
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isInRoom: { type: Boolean, default: false }
  }],
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    socketId: { type: String },
    isInRoom: { type: Boolean, default: true }
  }]
});

mongoose.model("Room", roomSchema);



// Example Document
let room = {
  _id: "mongoose objectId",
  roomName: "dynamic room Name",
  group: [ "array of object id" ],   // * group chat or oneToOne or private chat.........
  members: [                         // * website users who create an account in our website.
    {
      isInRoom : false,
      _id: "objectId",
      userId: "objectId",
      socketId: "YPj83S1xHqyZSkgwAAAz"
    }
  ]
}

// Example Document
let roomV2 = {
  _id: "mongoose objectId",
  roomName: "dynamic room Name",
  group: [                                 // * group chat or oneToOne or private chat.........
      { _id: "ObjectId", isInRoom: "bool" } //! NOTE 1
  ],
  members: [                         // * website users who create an account in our website.
    {
      isInRoom : false,
      _id: "objectId",
      userId: "objectId",
      socketId: "YPj83S1xHqyZSkgwAAAz"
    }
  ]
}

/*
! NOTE 1
* 1. we need to know user/friend is active chat room or not.
* 2. if user/friend not currently active in chat room (that you active like oneToOne room)
* 3. then you can send message notification him/them
*
* */