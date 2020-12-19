import React from 'react'

import './Textarea.css'

const Textarea = (props) => {
  const {  value, label, tauched, error, onChange, onClick, onBlur, placeholder, name } = props
    
  return (
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

export default Textarea
