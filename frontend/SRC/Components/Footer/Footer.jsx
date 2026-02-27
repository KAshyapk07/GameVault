import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/Logo2.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintrest_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className="footer">
       <hr className='lines'/>
        <div className="footerlogo">
         
            <img className='footer-logo-size' src={footer_logo} alt="" />
            <p id='title'>GameVault</p>
        </div>

        <ul className='footer-links'>
            <li><a href="/company" className="footer-link">Company</a></li>
            <li><a href="/products" className="footer-link">Products</a></li>
            <li><a href="/offices" className="footer-link">Offices</a></li>
            <li><a href="/about" className="footer-link">About</a></li>
            <li><a href="/contact" className="footer-link">Contact</a></li>


        </ul>
        <div className="footer-social-icons">
            <div className="footer-icons-container">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
             <img src={instagram_icon} alt="Instagram" />
            </a>
            </div>
            <div className="footer-icons-container">
            <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
             <img src={pintrest_icon} alt="Pinterest" />
            </a>
            </div>
            <div className="footer-icons-container">
            <a href="https://wa.me/9686097288" target="_blank" rel="noopener noreferrer">
                <img src={whatsapp_icon} alt="" />
                </a>
            </div>
        </div>
        <div className="footer-copyright">
          <hr className='lines'/>
          <p>copyright @ 2024 | All rights reserved</p>
        </div>
    </div>
  )
}

export default Footer
