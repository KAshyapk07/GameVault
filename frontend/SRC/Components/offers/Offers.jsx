import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/Logo.png'

const Offers = () => {
  return (
    <div className="offers">
        <div className="offers-left">
            <h1>Exclusive Offers</h1>
            <p>Only On Best Seller Product</p>
            <button>Check Now</button>
        </div>
        <div className="offers-right">
            <img src={exclusive_image} alt="" />
        </div>
    </div>
  )
}

export default Offers
