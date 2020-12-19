import React from 'react';

import "./ActiveBullet.scss"

function ActiveBullet(props) {
  return <span className={["icon", props.isActive ? "online" : "offline"].join(" ")}></span>;
}

export default ActiveBullet;