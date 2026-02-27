import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/Logo2.svg'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className="navbar">
        <img src={navlogo} alt="" className="nav-logo Resize" />
        <p id='Parent'>GameVault <p className='sub'>Admin Panel</p></p>

        <img src={navProfile} alt="" className='nav-profile' />
    </div>
  )
}

export default Navbar
