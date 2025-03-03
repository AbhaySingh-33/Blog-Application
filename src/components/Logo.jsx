import React from 'react'
import logoImage from "../assets/Logo.png";

const Logo = ({width='100px'}) => {
  return (
    <div>
      <img src={logoImage} alt="Logo" className="w-16 h-16 mx-auto" />
    </div>
  )
}

export default Logo