import React from 'react'
import { connect }  from 'react-redux'
import { NavLink }  from 'react-router-dom'


import { logOut, changeAvatar } from '../../store/actions/authActions'
import Avatar from '../Avatar/Avatar'

import './Navigation.scss'
import Notification from "../Notification/Notification";
import Badge from "../Badge/Badge";



const Navigation = (props) => {

  const fileInput = React.createRef()
  
  const [isOpenNotification, setOpenNotification] = React.useState(false)
  
  function openNotificationHandle(){
    setOpenNotification(!isOpenNotification)
  }

  function chooseAvatar(){
    if(fileInput.current){
      fileInput.current.click()
    }
  }

  function inputFileChange(){
    let data = new FormData()
    data.append('avatar', fileInput.current.files[0])   
    props.changeAvatar(data) 
    
  }

  const { auth, notification } = props

  return (
    <div>
      <div className="navigation">
        <nav className="main_nav">
        <ul className="nav common_nav">
          <li className="nav-item"><NavLink exact to="/">Home</NavLink></li>
          {props.auth._id && 
            <React.Fragment>
              <li className="nav-item"><NavLink to={`/chat/${auth.username}/room/${auth._id}`}>Chat</NavLink></li>
              <li className="nav-item"><NavLink to="/messenger">Messenger</NavLink></li>
              <li className="nav-item"><NavLink to="/find-friends">Find Friend</NavLink></li>
              {/* <li className="nav-item"><NavLink to={`/chat/?username=${auth.username}&room="room"&userId=${auth._id}`}>Chat</NavLink></li> */}
              
            </React.Fragment>
           }
        </ul>

        <ul className="nav auth_nav">
          {!props.auth._id ? (
              <React.Fragment>
                <li className="nav-item"><NavLink to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink to="/registration">Register</NavLink></li>
              </React.Fragment>
            ) : (
              <React.Fragment>
                
                  <div className="badge_root" onClick={openNotificationHandle} >
                    <i className="fal fa-bell"> </i>
                    <Badge color="blue" top={{ x: 7, y: -8 }} count={props.notification.messages && props.notification.messages.length} />
                    { isOpenNotification && props.notification.messages &&  props.notification.messages.length > 0 && <Notification /> }
                  </div>
               
                {/*<i onClick={openNotificationHandle} className="fal fa-bell">{props.notification.messages && props.notification.messages.length}*/}
                {/*  { isOpenNotification && <Notification /> }*/}
                {/*</i>*/}
                <div onClick={chooseAvatar}>
                  <Avatar  border  circle  size={{w:35, h:35}} src={auth.avatar}
                    style={{margin: '5px'}}
                  />
                </div>
                <input ref={fileInput} style={{display: "none"}} type="file" name="avatar" onChange={inputFileChange} />
                <span>{auth._id}...</span>
                <span>{auth.username}... </span>
                <li onClick={()=>props.logOut()}>Logout</li>
              </React.Fragment>
            ) }
        </ul>
        </nav>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  notification: state.notification
})


export default connect(mapStateToProps, { logOut, changeAvatar })(Navigation)
