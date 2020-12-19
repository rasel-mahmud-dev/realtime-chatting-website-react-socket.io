import React from 'react'

import './Input.css'

const Input = (props) => {
  const { type="text", value, control='input', label, tauched, error, onChange, onClick, onBlur, placeholder, name } = props
  return  control === 'input' ? (
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
  ) : (
      <div className="input_group">
      <label className={[error && tauched  ? "alert_error" : ""].join(" ")} htmlFor={name}>{label}</label>
      <textarea
        className={['textarea', error && tauched  ? "textarea_error" : ''].join(" ")} 
        name={name}
        onChange={onChange}
        onClick={onClick}
        onBlur={onBlur}
        placeholder={placeholder}
        value={value}
      ></textarea>
      {error && tauched && <span className="alert_error">{error}</span>}
    </div>
  )
}

Input.defaultProps = {
  type: "text", 
  placeholder: '', 
  name: '',
  value: '', 
  control: 'input', 
  label: '', 
  tauched: false, 
  error: ''
}

export default Input
