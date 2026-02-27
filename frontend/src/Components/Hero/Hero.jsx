import React from 'react'
import './Hero.css';
import arrow_icon from '../Assets/arrow.png';
import GtaV from '../Assets/GTAV2.jpg';
// import GtaV_background from "../Assets/Background Video/cinematics.mp4"

const Hero = () => {

  const scrollToNewCollections = () => {
    const section = document.getElementById('new-collections');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container">
      
   
    <div className="hero">
    {/* We will use a direct URL for the video instead of a local import */}
    <video id='Background-clip2' autoPlay muted loop src="https://res.cloudinary.com/dzhbpny03/video/upload/v1772168095/GtaV_background_gxmtiu.mp4"></video>
      <div className="hero-left">
      <h2>New Arrivals Only</h2>
          <div>
            <p>Collections</p>
            <p>for everyone</p>
      </div>
      <div className="hero-latest-btn" onClick={scrollToNewCollections}>
        <div>Latest Collection</div>
        <img src={arrow_icon} alt="" />
      </div>
      </div>
      <div className="hero-right">
        <img src={GtaV} alt="" />
    </div>
    </div>
    </div>
  )
}

export default Hero
