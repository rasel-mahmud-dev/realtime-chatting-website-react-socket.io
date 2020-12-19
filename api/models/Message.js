
const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  messages: [{
    text: String,
    createdAt: { type: Date, default : Date.now() },
    sender: {
      type:  mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    userId: {
      type:  mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
  }],
  roomName: { type: String, required: true }
})

mongoose.model('Message', messageSchema)

// Example Document............
let message = {
  _id: 'unique id',
  roomName: "room name",
  messages: [{
    _id: "id",
    text: "some text",
    userId: "ObjectId",  // * who received it
    sender: "ObjectId", // * who send it
    createdAt: "current Timestamp"
  }]
}

