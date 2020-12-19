import React from "react";
import { connect } from "react-redux";
import Avatar from "../../components/Avatar/Avatar";
import io from "socket.io-client";
import "./Messenger.scss";
import api, {socket} from '../../apis/api'

import ScrollBottom from '../../components/ScrollBottom/ScrollBottom'
import {fetchFriends} from "../../store/actions/userAction";
import fullLink from "../../utils/fullLink";
import Input from "../../components/Form/Input";
import ActiveBullet from "../../components/ActiveBullet/ActiveBullet";

class Messenger extends React.Component {
  state = {
    rooms: [
      {
        _id: "F",
        roomName: "FFFF",
        group: [ { id: { _id: "userId", avatar: "", username: ""}, isInRoom: true} ]
      }
    ],
    text: "",
    leaveMessage: {},
    chatFriends: [],
    oldMessages: [],
    messages: [],
    hoverOnTrashIndex: -1,
    currentFriend: {_id: "", avatar: "", username: "", isInRoom: false, roomName: "" }
  };

j = {"isInRoom":true,"id":{"_id":"5fd8c82c09612529c85aeb92","username":"raju","avatar":"images\\avatar\\img_avatar3 (2)_20201215_2014145.png"}}

  componentDidMount() {
    this.socket = io("http://localhost:4002");
  
    this.props.fetchFriends("populate")

    this.socket.on("sendMessage", messages => {
      this.setState({ messages: [messages] });
      // console.log(messages);
      
    });
    // this.socket.on("roomCreate", ({ newRoom, messages, rooms }) => {
    //   let updatedRooms = [...rooms]
    //   let haveRoom = updatedRooms.findIndex(room => room.userId == newRoom.userId)
    //   if(haveRoom == -1){
    //     updatedRooms.push(newRoom)
    //   } else {
    //     updatedRooms[haveRoom] = newRoom
    //   }
    //   // console.log(updatedRooms);
    //   this.setState({
    //     currentOwnRoom: newRoom,
    //     messages: messages,
    //     rooms: updatedRooms
    //   });
    //   // console.log(newRoom);
    // });
   
    this.socket.on("leaveChat", (removeUser) => {
      let rooms = [...this.state.rooms]
      let removeUserIndex = rooms.findIndex(room=>room.userId == removeUser.userId)
      rooms[removeUserIndex]  = removeUser
      this.setState({ rooms })

      // this.setState({
      //   leaveMessage: message,
      //   room: [...this.state.room, message.room],
      //   chatFriends: message.chatFriends
      // });
    });
    
    this.socket.on("onToOneRoom", ({ currentFriend, messages, rooms })=>{
      let updatedRooms = rooms
      this.setState({
        currentFriend,
        messages: messages,
        rooms: updatedRooms
      });
    })
    this.socket.on("onToOneRoomMessage", ({roomName, message})=>{
      let messages = [...this.state.messages]
      let existRoomIndex = messages.findIndex(msg=>msg.roomName === roomName )
      if(existRoomIndex !== -1){
        messages[existRoomIndex].messages.push(message)
      }else{
        messages[0].messages = [messages]
      }
      this.setState({messages: messages})
    })
    this.socket.on("onToOneRoomDeleteMessage", ({roomName, messageId})=>{
      let messages = [...this.state.messages]
      let f = messages.findIndex(m=>m.roomName == roomName )
      let m = messages[f]
      let findMessageIndex = m.messages.findIndex(m=>m._id === messageId )
      if(findMessageIndex !== -1){
        m.messages.splice(findMessageIndex, 1)
      }
      this.setState({ messages: messages })
    })
  
    this.socket.on("getOnlineUser", (room)=>{
      // console.log(room)
      // this.props.storeOnlineUsers(room)
      console.log("notify    ", room)
    })
    
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.auth != this.props.auth){
      if(!this.props.auth.friends){
        this.props.fetchFriends("populate")
      }
    }
    if (prevState.currentFriend._id != this.state.currentFriend._id){
      console.log("your oneToOne room isInRoom = false")
      this.socket.emit("LeaveOnToOneRoom", {
        userId: this.props.auth._id,
        friendId: prevState.currentFriend._id,
        roomName: prevState.currentFriend.roomName
      })
    }
  }
  
  
  componentCleanup=()=>{
    const { roomName, _id } = this.state.currentFriend
    this.socket.emit("LeaveOnToOneRoom", {
      userId: this.props.auth._id,
      friendId: _id,
      roomName: roomName
    })
  }
  
  
  
  componentWillUnmount() {
    // this.socket.emit("disconnect");
   
    this.componentCleanup();
    window.removeEventListener('beforeunload', this.componentCleanup);
    
  }
  joinOneToOnePrivateRoom = (friend) => {
    const { _id } = this.props.auth;
    this.socket.emit("onToOneRoom", { roomName: _id + " " + friend._id, userId: _id, friendId: friend._id });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { _id } = this.props.auth;
    const { rooms, currentFriend } = this.state
    
    this.socket.emit("onToOneRoomMessage", {
      text: this.state.text,
      roomName: rooms.roomName,
      userId: { _id: currentFriend._id, isInRoom: currentFriend.isInRoom },
      sender:  _id
    });
  };
  
  deleteMessage=(messageId)=>{
    const { currentFriend, rooms } = this.state
    socket.emit("onToOneRoomDeleteMessage", { roomName: rooms.roomName, messageId: messageId  })
  }
  
  createdAt = date => {
    let n = new Date(date);
    return (
      "send on " + n.getHours() + ":" + n.getMinutes() + ":" + n.getSeconds()
    );
  };
  onHoverMessage =(i, type)=>{
    if(type === "leave"){
      this.setState({hoverOnTrashIndex: -1})
    } else{
      this.setState({hoverOnTrashIndex: i})
    }
  }
  
  fetchRoom=(e)=>{
    api.get("/api/fetch_roomm").then(data=>{
      console.log(data.data)
    })
  }
  
  render() {
    const { auth, chat } = this.props;
    const { messages, rooms, hoverOnTrashIndex } = this.state;
    return (
      <div className="messenger">
        <div className="messenger_sidebar">
          <ul>
            <h4 className="active-friend_title">Recent Message</h4>
            <li>Almin</li>
            <li>Alex</li>
            <button onClick={this.fetchRoom}>fetchRoom</button>
          </ul>
        </div>

        <div className="messenger_message">
          {/* Show Room */}
          {/* <div>
            {this.state.room.length > 0 && this.state.room.map(room=>(
              <div>{room.userId == auth._id &&  <small> Room: {room.room}</small>}</div>
            ))}
          </div> */}

          {/*<p>{this.state.leaveMessage && this.state.leaveMessage.text}</p>*/}

          {/* Show Active Status ..... */}
          <div className="chat-header">
            { rooms.group && rooms.group.map(patner=>{
              return patner.id._id !== auth._id && (
                  <div className="active-chat-patner" >
                    <div className="patner_avatar"><Avatar src={ fullLink(patner.id.avatar)}size={{ w: 25, h: 25 }} circle /></div>
                    <p className="username">{patner.id.username}</p>
                    <ActiveBullet  isActive={patner.id.isInRoom || this.state.currentFriend.isInRoom } />
                  </div>
              )
            })}
            
  
            <small>{rooms.roomName && rooms.roomName}</small>
            
            
            {/*{ rooms.group && rooms.group.length > 0 &&*/}
            {/*    rooms.group.map(user => {*/}
            {/*    // return room.userId != auth._id && (*/}
            {/*    //   <React.Fragment>*/}
            {/*    //     <span>{room.userId}</span>*/}
            {/*    //     <span> {room.isInRoom ? "Online" : "Offline"} </span>*/}
            {/*    //   </React.Fragment>*/}
            {/*    // )*/}
            {/*    return room.group.indexOf(auth._id) !== -1 && (*/}
            {/*        <li>{user._id}</li>*/}
            {/*        // <React.Fragment>*/}
            {/*        //   <span>{room.userId}</span>*/}
            {/*        //   <span> {room.isInRoom ? "Online" : "Offline"} </span>*/}
            {/*        // </React.Fragment>*/}
            {/*    )*/}
            {/*  })  */}
            {/*}*/}
          </div>

          <ScrollBottom containerRef={this.chatMessageRef} watcher={ messages }>
            <div ref={(e)=>this.chatMessageRef=e} className="chat_message">
              <div className="messages-list">

                {/* Database Message.......... */}
                {/* old Message............. */}
                { messages && messages.length > 0 && messages.map(message=>{
                  return message.messages && message.messages.length > 0 &&
                    message.messages.map((msg, i) => {
                      return msg.sender == auth._id ? (
                        <li key={i} className="own-message single-message"
                            onMouseLeave={()=>this.onHoverMessage(i, "leave")}
                            onMouseOver={()=>this.onHoverMessage(i, "over")} >
                          <div className="row">
                            
                            <Avatar
                              src={auth.avatar}
                              size={{ h: 18, w: 18 }}
                              circle
                            />
                            <span className="message-text">{msg.text}
                            </span>
                          </div>
                          <span className="message_send_time">
                            {this.createdAt(msg.createdAt)}
                            <i onClick={()=>this.deleteMessage(msg._id)} className={["fal fa-trash", hoverOnTrashIndex === i ? "trash_visiable": " " ].join(" ")}></i>
                          </span>
                        </li>
                      ) : (
                        <li key={i} className="friend-message single-message"
                            onMouseLeave={()=>this.onHoverMessage(i, "leave")}
                            onMouseOver={()=>this.onHoverMessage(i, "over")} >
                          <div className="row">
                            <Avatar src={fullLink(this.state.currentFriend.avatar)} size={{h: 18, w: 18}} circle />
                            <span className="message-text">{msg.text}</span>
                          </div>
                          <span className="message_send_time">
                            {this.createdAt(msg.createdAt)}
                            <i onClick={()=>this.deleteMessage(msg._id)} className={["fal fa-trash", hoverOnTrashIndex === i ? "trash_visiable": " " ].join(" ")}></i>
                          </span>
                        </li>
                      );
                    })
                  })}
      
                </div>
              </div>
            </ScrollBottom>

          <div className="message_input">
            <form className="message_form" onSubmit={this.handleSubmit}>
              <Input
                  type="text"
                  name="text"
                  value={this.state.text}
                  onChange={e => this.setState({ text: e.target.value })}
              />
              <button  className="message_send_button">Send</button>
            </form>
          </div>
        </div>

        <div className="messenger_friendList">
          <ul className="messenger_friendList_ul">
            <h4 className="active-friend_title">Active Friend { auth.friends && auth.friends.length } </h4>
            { auth.friends && auth.friends.map(friend=>(
                  <li key={friend._id} className="list-item">
                    {/*<span*/}
                    {/*  className={[*/}
                    {/*    "icon",*/}
                    {/*    user.isOnline ? "online" : "offline"*/}
                    {/*  ].join(" ")}*/}
                    {/*/>*/}
                    <Avatar
                      className="mr-5 ml-5"
                      src={fullLink(friend.avatar)}
                      size={{ w: 20, h: 20 }}
                      circle
                    />
                    <span
                      onClick={() => this.joinOneToOnePrivateRoom(friend)}
                      className="username"
                    >
                      {friend.username}
                    </span>
                  </li>
              ))
              
              
            }
            {/*{chat.onlineUsers &&*/}
            {/*  chat.onlineUsers.length > 0 &&*/}
            {/*  chat.onlineUsers.map(user => (*/}
            {/*    <React.Fragment key={user.socketId}>*/}
            {/*      {auth._id !== user.userId && (*/}
            {/*        <li className="list-item">*/}
            {/*          <span*/}
            {/*            className={[*/}
            {/*              "icon",*/}
            {/*              user.isOnline ? "online" : "offline"*/}
            {/*            ].join(" ")}*/}
            {/*          />*/}
            {/*          <Avatar*/}
            {/*            className="mr-5 ml-5"*/}
            {/*            src={user.avatar}*/}
            {/*            size={{ w: 20, h: 20 }}*/}
            {/*            circle*/}
            {/*          />*/}
            {/*          <span*/}
            {/*            onClick={() => this.privateMessage(user)}*/}
            {/*            className="username"*/}
            {/*          >*/}
            {/*            {user.username}*/}
            {/*          </span>*/}
            {/*        </li>*/}
            {/*      )}*/}
            {/*    </React.Fragment>*/}
            {/*  ))}*/}
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth, chat: state.chat };
}

export default connect(
  mapStateToProps,
  
    {fetchFriends}
)(Messenger);
