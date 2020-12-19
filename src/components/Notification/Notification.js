import React from 'react';
import {connect} from 'react-redux';

import "./Notification.scss"
import Avatar from "../Avatar/Avatar";
import fullLink from "../../utils/fullLink";

const Notification = (props) => {
  const { auth, notification } = props
  return (
      <div className="notification_panel">
        {  notification.messages && notification.userId === auth._id &&  notification.messages.map(notification=>(
            <div className="notification_item">
             <div className="left">
               <Avatar size={{w: 20, h: 20}} circle src={fullLink(notification.sender.avatar)} />
               <span className="notification_message">{notification.title}</span>
             </div>
             <div className="right">
                <i className="fal fa-clock"></i>
                <span className="time">2 hour ago</span>
             </div>
            </div>
        )) }
      </div>
  );
}

function mapStateToProps(state) {
  return { auth: state.auth, notification: state.notification };
}

export default connect(mapStateToProps, {})(Notification);