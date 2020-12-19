import React from "react";
import { connect } from "react-redux";

import { storeUsers, onlineUser, offlineUser } from '../../store/actions/chatActions'

import ActiveFriendList from './ActiveFriends/ActiveFriends'
import ChatMessage from './ChatMessage/ChatMessage'

import io from "socket.io-client";
import "./Chat.scss";

const uri = "http://localhost:4002";




class Chat extends React.Component {
  state = {
    messages: [],
    message: '',
  };

  componentDidMount() {
    const { username, userId, room } = this.props.match.params
    this.socket = io(uri);
    this.socket.emit("join", { username, userId, room });

    this.socket.on("grettingMessage", message => {
      this.props.storeUsers(message.onlineUsers)
      this.props.onlineUser(message.onlineUser)
      this.setState({ messages: [...this.state.messages, message] });
    });

    this.socket.on("message", message => {
      console.log(message);
      
      this.setState({ messages: [...this.state.messages, message] });
    });

    this.socket.on("leaveMessage", message => {
      if(message.leaveUser){
        this.props.offlineUser(message.leaveUser)
      }
      this.props.storeUsers(message.onlineUsers)
      this.setState({ messages: [...this.state.messages, message] });
    });
  }

  componentWillUnmount() {
    this.socket.emit("disconnect");
    this.socket.off();
  }

  handleSendMessage = (e)=>{
    e.preventDefault()
    this.socket.emit("message", this.state.message)    
  }


  inputChange = (e)=> {
    this.setState({ message: e.target.value });
  };
  

  joinChatWithFriend=(friendname)=>{
    const { username, userId } = this.props.match.params
    this.socket.emit("join", { username, userId, room: friendname + " " + userId });
  }


  render() {
    return (
      <div className="Chat">
        <div className="chat-message-div">
          <ChatMessage messages={this.state.messages} auth={this.props.auth}  />
          <div className="messageForm">
            <form onSubmit={this.handleSendMessage}>
              <input
                type="text"
                name="message"
                value={this.state.message}
                onChange={this.inputChange}
              />
              <button>Send</button>
            </form>
          </div>
        </div>

        <div className="active-friend-list">
          <ActiveFriendList auth={this.props.auth} joinChatWithFriend={this.joinChatWithFriend} onlineUsers={this.props.users} />
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  users: state.chat
});

export default connect( mapStateToProps, { storeUsers, offlineUser, onlineUser })(Chat);

// import React from "react";
// import { connect } from "react-redux";
// import io from "socket.io-client";
// import "./Chat.scss";

// const uri = 'http://localhost:4002'

// const Chat = props => {
//   let socket = io(uri)

//   const [messages, setMessages] = React.useState([])

//   React.useEffect(()=>{
//     socket.emit("join", {
//       username: props.auth.username,
//       userId: props.auth._id
//     });

//     socket.on('grettingMessage', (message)=>{
//       setMessages([...messages, message])
//     })

//     // socket.on("leaveMessage", message => {
//     //   setState({ messages: [...state.messages, message] });
//     // });

//     return ()=>{
//       socket.emit("disconnect");
//       socket.off();
//     }

//   }, [props.location.search])

//   console.log(messages);

//   return (
//     <div className="Chat">
//       <div className="chatMessage">
//         <ul className="messages-list">
//           {messages.map((message, i) =>
//             message.user.username === props.auth.username ? (
//               <li key={i} className="own-message">
//                 <strong>You </strong>
//                 <span className="message">{message.text}</span>
//               </li>
//             ) : (
//               <li key={i} className="friend-message">
//                 <strong>{message.user.username} </strong>{" "}
//                 <span className="message">{message.text}</span>
//               </li>
//             )
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// const mapStateToProps = state => ({
//   auth: state.auth
// });

// export default connect(
//   mapStateToProps,
//   null
// )(Chat);

// import React from "react";
// import { connect } from "react-redux";
// import io from "socket.io-client";
// import "./Chat.scss";

// class Chat extends React.Component {
//   state = {
//     text: "",
//     user: {},
//     messages: [],
//     isAuth: false,
//     writting: {},
//     writtingMode: false
//   };

//   componentDidMount() {
//     if (this.props.auth.username) {
//       this.socket = io("http://localhost:4002");

//       // pass / send.........
//       this.socket.emit("join", {
//         username: this.props.auth.username,
//         userId: this.props.auth._id
//       });

//       // recieved
//       this.socket.on("grettingMessage", message => {
//         this.setState({ messages: [...this.state.messages, message] });
//       });

//       this.socket.on("leaveMessage", message => {
//         this.setState({ messages: [...this.state.messages, message] });
//       });
//     }
//   }

//   componentWillUnmount() {
//     this.socket.emit("disconnect");
//     this.socket.off();
//   }

//   handleSubmit = e => {
//     e.preventDefault();
//     this.setState({ writtingMode: false });
//     if (this.state.text) {
//       // this.socket.emit("sendMessage", this.state.text);
//     }
//   };

//   handleJoin = user => {
//     // this.setState({ user, isAuth: true });
//   };

//   inputChange = e => {
//     // this.socket.emit("writting", e.target.value)
//     this.setState({ text: e.target.value, writtingMode: true });
//   };
//   // inpuClick=(e)=>{
//   //   this.setState({ writtingMode: true })
//   // }
//   // inpuBlur=(e)=>{
//   //   console.log("blur");
//   //   this.setState({ writtingMode: false })
//   // }

//   waves = () => {
//     return (
//       <div className="root_waves">
//         <span />
//         <span />
//         <span />
//       </div>
//     );
//   };

//   render() {
//     console.log(this.state.messages);

//     return (
//       <div className="Chat">
//         <div>
//           <div className="chatMessage">
//             <ul className="messages-list">
//               {this.state.messages.map((message, i) =>
//                 message.user.username === this.props.auth.username ? (
//                   <li key={i} className="own-message">
//                     <strong>You </strong>
//                     <span className="message">{message.text}</span>
//                   </li>
//                 ) : (
//                   <li key={i} className="friend-message">
//                     <strong>{message.user.username} </strong>{" "}
//                     <span className="message">{message.text}</span>
//                   </li>
//                 )
//               )}
//             </ul>
//           </div>

//           {/* {this.props.match.params.userName != this.state.writting.userName && (
//             <React.Fragment>
//               {this.state.writting.userName && !this.state.writtingMode && (
//                 <span className="writting_status">
//                   <span style={{ marginRight: "5px" }}>
//                     {this.state.writting.userName}
//                   </span>
//                   <span> writting something </span>
//                   <span> {this.waves()} </span>
//                 </span>
//               )}
//               {this.state.writting.text}
//             </React.Fragment>
//           )} */}

//           <form onSubmit={this.handleSubmit}>
//             <input
//               type="text"
//               value={this.state.text}
//               onChange={this.inputChange}
//               onBlur={this.inpuBlur}
//               onClick={this.inpuClick}
//             />
//             <button>Send</button>
//           </form>
//         </div>
//       </div>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   auth: state.auth
// });

// export default connect(
//   mapStateToProps,
//   null
// )(Chat);
