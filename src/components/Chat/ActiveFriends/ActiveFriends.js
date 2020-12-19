import React from 'react'

import './ActiveFriends.scss'
import Avatar from '../../Avatar/Avatar';
import ActiveBullet from "../../ActiveBullet/ActiveBullet";



const ActiveFriends = (props) => {

  const { onlineUsers, auth, title } = props
  
  const joinChatWithFriend=(friendname)=>{
    // props.joinChatWithFriend(friendname);
  }

  function getFullImageLink(link) {
    let url = 'http://localhost:4002'
    return `${url}/${link}`
  }
  
  return (
    <div className="active-friend-list_wrapper" >
      <h4>{title}</h4>
      <ul className="active-friend-list-item">
        { onlineUsers && onlineUsers.length > 0 && onlineUsers.map(user=>(
          <li key={user.userId._id} className="list-item">
            <div className="name_avatar">
              <Avatar size={{w: 15, h: 15}} circle src={getFullImageLink(user.userId.avatar)}/>
              <span onClick={() => joinChatWithFriend(user.userId)}
                    className="username">{user.userId._id == auth._id && " (you) "}{user.userId.username}</span>
            </div>
            <ActiveBullet isActive={user.isInRoom}/>
          </li>
        ))}
      </ul>
      </div>
  )
}

export default ActiveFriends
