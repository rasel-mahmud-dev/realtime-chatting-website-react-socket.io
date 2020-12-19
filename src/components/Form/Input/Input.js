import React from 'react'

import './Input.css'

const Input = (props) => {
  const { type="text", value, label, tauched, error, onChange, onClick, onBlur, placeholder, name } = props
    
  return (
    <div className="input_group">
      <label className={[error && tauched ? "alert_error" : ""].join(" ")} htmlFor={name}>{label}</label>
      <input
        className={['input', error && tauched ? "input_error" : ''].join(" ")} 
        type={type}
        name={name}
        onChange={onChange}
        onClick={onClick}
        onBlur={onBlur}
        placeholder={placeholder}
        value={value}
      />
      {error && tauched && <span className="alert_error">{error}</span>}
    </div>
  )
}

export default Input
