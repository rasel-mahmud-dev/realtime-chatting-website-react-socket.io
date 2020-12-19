import React from "react";
import { connect } from "react-redux";
import { login } from "../../store/actions/authActions";

import "./LoginPage.scss";

const Login = props => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function onLogin(e) {
    e.preventDefault();
    props.login({ email, password }, props.history.push)
  }

  return (
    <div className="container">
      <div className="login-form">
        <form onSubmit={onLogin}>
          <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default connect(
  null,
  { login }
)(Login);
