import React from "react";

import './ChatMessage.scss'

const ChatMessage = (props) => {
  const { messages, auth } = props
  return (
    <div className="chatMessage">
      <ul className="messages-list">
        {messages && messages.map((message, i) =>
          message.user.username === auth.username ? (
            <li key={i} className="own-message">
              <strong>You </strong>
              <span className="message">{message.text}</span>
            </li>
          ) : (
            <li key={i} className="friend-message">
              <strong>{message.user.username} </strong>{" "}
              <span className="message">{message.text}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ChatMessage;
