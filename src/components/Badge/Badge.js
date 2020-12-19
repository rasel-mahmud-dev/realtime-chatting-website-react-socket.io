import React from 'react'
import './Badge.css'
import classnames from 'classnames'

const badge = (props) => {
  const { count, style={}, className, color, top, left, shake, children } = props

  const badgeCountClasses = classnames(
    className,
    'badge', 
    top && `badge_top`,
    left && `badge_left`,
    color && `badge-${color}`
  )

  let styles = { ...style }
  if(top && typeof top === 'object'){
    styles.transform= `translate(${top.x}px, ${top.y}px)`
  }
  else if(top && top !== (true || undefined)){
    styles.transform= `translateY(${top}px)`
  }

  return <span style={styles} className={badgeCountClasses}>{count}</span>
    
}

export default badge
