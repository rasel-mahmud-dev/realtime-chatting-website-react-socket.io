import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import io from 'socket.io-client'
import "./App.scss";

import InitialSocket from './socket/initialSocket'


import { connect } from 'react-redux'
import { autoLogin } from './store/actions/authActions'
import { storeSocket, storeOnlineUsers, leaveRoom } from './store/actions/chatActions'
import { fetchUsers } from './store/actions/userAction'
import { pushNotification } from './store/actions/notificationAction'

import Navigation from "./components/Navigation/Navigation"
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage'
// import Chat from "./components/Chat/Chat"
import HomePage from './pages/HomePage/HomePage'
import Messenger from './pages/Messenger/Messenger'
import {baseUri, socket} from "./apis/api";
import FindFriends from "./pages/FindFriends/FindFriends";


const memberInstance = new InitialSocket(io)


class App extends React.Component {

  state = { onlineUsers: []}
      
  componentDidMount() {
    
    socket.on("getOnlineUser", (room)=>{
      this.props.storeOnlineUsers(room)
    })
    
    socket.on("get_notification_private_chat", (notifications)=>{
      this.props.pushNotification(notifications)
      console.log(notifications)
    })

    socket.on("forceDisconnect", (leaveRoomUser)=>{
      this.props.leaveRoom(leaveRoomUser) 
    })
    
    socket.on('leaveOnlineUser', (leaveRoomUser)=>{
      console.log(leaveRoomUser);
      this.props.leaveRoom(leaveRoomUser)
    })

    this.props.autoLogin((username, _id, email, avatar)=>{
      socket.emit("join", { username, _id, email, avatar })
    })
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.auth._id !== prevProps.auth._id){
      let { username, _id, email, avatar } =  this.props.auth
      socket.emit("join", { username, _id, email, avatar })
    }
  }

  componentWillUnmount(){
    socket.emit("disconnect")
  }

  render() {    
    return (
      <div className="App">
          <Navigation />
          {/* <button onClick={this.out} >Out</button> */}
          <Switch>
            <Route exact path='/' component={(props)=> <HomePage {...props} /> } />
            <Route path='/login' component={LoginPage} />
            <Route path='/registration' component={RegisterPage} />
            <Route path='/find-friends' component={FindFriends} />
             <Route path='/messenger' component={Messenger} />
            {/* <Route path='/chat/:username/:room/:userId' component={Chat} /> */}
          </Switch>
        
      </div>
    );
  }
}



function mapStateToProps(state){
  return { auth: state.auth, chat: state.chat }
}

export default connect(mapStateToProps, { autoLogin, storeSocket, storeOnlineUsers, leaveRoom, fetchUsers, pushNotification })(App);
