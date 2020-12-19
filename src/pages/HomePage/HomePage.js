import React from 'react'
import { connect } from 'react-redux' 
import './HomePage.scss'

import ActiveFriends from '../../components/Chat/ActiveFriends/ActiveFriends'
import ScrollBottom from '../../components/ScrollBottom/ScrollBottom'

const HomePage = (props) => {

  const { onlineUsers, auth, chat } = props
  let memberRoom  = chat.rooms && chat.rooms.find(room=>room.roomName == 'member' )
  if(memberRoom) memberRoom = memberRoom.members
        
  return (
   <div className="container">
      <div className="row">
      <div className="left">
        <h1>Simple Real Chat App</h1>
        <ScrollBottom/>
      </div>
      <div className="right">
        { !auth._id ? (
          <p>To see online user please login </p>
        ) : (
          <ActiveFriends title="Active Members" onlineUsers={memberRoom} auth={auth} />
        )
      }
      </div>
    </div>
   </div>
  )
}


function mapStataToProps(state){
  return { auth: state.auth, chat: state.chat }
}

export default connect(mapStataToProps, null)(HomePage)
