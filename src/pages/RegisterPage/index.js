import React from "react";
import { connect } from 'react-redux'
import { register } from '../../store/actions/authActions'
import Joi from "@hapi/joi";

import Input from "../../components/Form/Input";

let initalState = {
  username: { value: "", errorMessage: "", tauched: false },
  email: { value: "", errorMessage: "", tauched: false },
  password: { value: "", errorMessage: "", tauched: false },
  confirmPassword: { value: "", errorMessage: "", tauched: false },
};

const RegisterPage = (props) => {
  const [state, setState] = React.useState(initalState);
  const [isFormValid, setFormValid] = React.useState(undefined);



  function changeValidate(name, value) {
    const schema = Joi.object({
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

      password: Joi.string(),
      // confirmPassword: Joi.ref("password"),
      confirmPassword: Joi.string(),

      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] }
      })
    })
    
    let { error }  = schema.validate({[name]: value}, {abortEarly: false}) 
    let errors = {
      username: '',    
      email: '',    
      password: '',    
      confirmPassword: '',    
    }

    if(error){
      for(let err of error.details){
        if(err){
          errors[err.path[0]] = err.message
        }
      }
    }
    return errors
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let errors = changeValidate(name, value)

    let updateState = {
      ...state,
      [name]: {
        ...state[name],
        value: value,
        tauched: true,
        errorMessage: errors[name]
      }
    };
    setState(updateState);    
  }

  function handleSubmit(e) {
    e.preventDefault();
    let isFormValidrrrrrrrr = true;
    for(let field in state){
      isFormValidrrrrrrrr = isFormValidrrrrrrrr 
                  && state[field].errorMessage === "" 
                  && state[field].tauched
    }
    if(!isFormValidrrrrrrrr) return setFormValid(false)
    props.register({
      username: state.username.value,
      email: state.email.value,
      password: state.password.value
    }, props.history.push)
  }

  return (
    <div className="container">
      <h1>Registration</h1>

      { isFormValid === false &&  <h1 className="alert_error">Form is not Complete</h1>}

      <form onSubmit={handleSubmit}>
        <Input
          name="username"
          label="Enter You Name"
          type="text"
          onChange={handleChange}
          value={state.username.value}
          error={state.username.errorMessage}
          tauched={state.username.tauched}
        />
        <Input
          name="email"
          label="Enter You Email"
          type="text"
          onChange={handleChange}
          value={state.email.value}
          error={state.email.errorMessage}
          tauched={state.email.tauched}
        />
        <Input
          name="password"
          label="Enter You Password"
          type="password"
          onChange={handleChange}
          value={state.password.value}
          error={state.password.errorMessage}
          tauched={state.password.tauched}
        />
        <Input
          name="confirmPassword"
          label="Enter Confirm Password"
          type="password"
          onChange={handleChange}
          value={state.confirmPassword.value}
          error={state.confirmPassword.errorMessage}
          tauched={state.confirmPassword.tauched}
        />

        <button>Register</button>
      </form>
    </div>
  );
};

export default connect(null, { register })(RegisterPage);
