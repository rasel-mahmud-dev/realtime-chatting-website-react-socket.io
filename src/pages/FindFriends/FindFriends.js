import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchUsers, addFriend, removeFriend, fetchFriends} from "../../store/actions/userAction";
import fullLink from "../../utils/fullLink";
import Avatar from "../../components/Avatar/Avatar";

import "./FineFriends.scss"

class FindFriends extends Component {
  
  componentDidMount() {
    this.props.fetchUsers()
    // this.props.fetchFriends("populate")
    this.props.fetchFriends("j")
  }
  
  
  clickFriend=(friendId)=>{
    this.props.addFriend(friendId)
  }
  h=(id)=>{
    console.log(id, this.props.auth.friends)
  }
  
  renderProples=(peoples)=>{
    return peoples && peoples.length > 0 && peoples.map(people=>{
      return people._id !== this.props.auth._id && (
        <li className="people">
          <div className="left">
          <span className="people_avatar">
          <Avatar size={{w: 25}} circle src={fullLink(people.avatar)}/>
        </span>
            <span className="people_name">{people.username}</span>
          </div>
          { this.h(people._id) }
          { this.props.auth.friends &&  this.props.auth.friends.indexOf(people._id) !== -1 ? (
            <button onClick={()=>this.props.removeFriend(people._id)}>UnFriend</button>
          ) : (
            <button onClick={()=>this.props.addFriend(people._id)}>Add Friend</button>
          ) }
        </li>
      )
    })
  }
  
  render() {
    console.log(this.props.auth)
    return (
        <div>
          <h4>All Peoples</h4>
          <div className="peoples_wrapper">
            { this.renderProples(this.props.users) }
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users,
    auth: state.auth
  }
}

export default connect(mapStateToProps, {fetchUsers, addFriend, removeFriend, fetchFriends })(FindFriends);