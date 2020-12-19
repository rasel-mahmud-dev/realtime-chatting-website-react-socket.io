import React from 'react'

import "./FilterComponent.scss"

import { Container, Row, Col } from "components/Layout"
import Input from "components/Form/Input/Input"
import Input2 from "components/Form/Input/Input2"
import Button from "components/Button/Button"
import Preload from "components/Preload/Preload"
import Box from "components/Box/Box"

const FilterComponent = () => {
  return (
    <div className="product-page-filter">
      <div className="item">
        <label htmlFor="">show per page</label> 
        <select name="" id="">
          <option value="1">1</option>
          <option value="1">2</option>
        </select>
      </div>
      <div className="item">
        <label htmlFor="">sort</label> 
        <select name="" id="">
          <option value="1">date</option>
          <option value="1">name</option>
          <option value="1">brand</option>
          <option value="1">price</option>
        </select>
      </div>
      <div className="item flex-1">
        <Input2 label="Search Product..." />        
      </div>
    </div>
  )
}

export default FilterComponent
