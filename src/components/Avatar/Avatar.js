import React from 'react'
import classnames from 'classnames'

import './Avatar.css'

const Avatar = (props) => {
  const { circle, style, size, className, border, src, alt, srcSet } = props

  const avatarClasses = classnames(
    'avatar',
    circle && `circle`,
    border && `border`
  )
  

  const avatarRootClasses = classnames(
    className,
    'avatar_root',
  )
  let styles={...style}
  if(size && typeof size === 'object'){
    styles.width = size.w && `${size.w}px`
    styles.height = size.h && `${size.h}px`
  }
  else if(size && typeof size !== 'object'){
    styles.width = `${size}%`
  }
  

  return (
    <div style={styles} className={avatarRootClasses}>
      <img className={avatarClasses} src={src} alt={alt} srcSet={srcSet} />
    </div>
  )
}

export default Avatar
