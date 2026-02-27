import React from 'react'
import './Newsletter.css'


const Newsletter = () => {
  return (
    <div className="newsletter">
            <h1> Get Exclusive Offers On Your Email</h1>
            <p>Subscribe to our Newsletter and Stay Updated</p>
            <div className="email">
                <input type="email" placeholder='Your Email' />
                <button onClick={()=>{alert("Offers will be Notified On Your Email")}}> Subscribe</button>
            </div>
    </div>
  )
}

export default Newsletter
