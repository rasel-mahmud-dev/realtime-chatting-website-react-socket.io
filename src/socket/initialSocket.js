
const uri = "http://localhost:4002";


export default class SOCKET{
  constructor(io){
    this.socket = new io(uri)
  }

  initialize(){
    return this.socket
  }

  onJoinOnline(eventName, callback){
    this.socket.on(eventName, (result)=>{
      callback(result)
    }) 
  }

  emitJoinOnline(eventName, payload){
    this.socket.emit(eventName, payload)
  }

  onLogout(eventName, callback){
    this.socket.on(eventName, (result)=>{
      callback(result)
    })
  }

  onLeaveOnline(eventName, callback){
    this.socket.on(eventName, (result)=>{
      callback(result)
    })
  }

  emitLeaveOnline(eventName, payload){
    this.socket.emit(eventName, payload)
  }

}
