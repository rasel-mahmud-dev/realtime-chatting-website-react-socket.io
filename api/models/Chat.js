
const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  message: [],
  userId: {
    type:  mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  sendername: String,
  sendby: {
    type:  mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  room: String
})

mongoose.model('Chat', chatSchema)