import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
  const handleProductClick = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/incrementviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: props.id }),
      });
      console.log(`Views incremented for product ${props.id}`);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  
  return (
    <div className="item" onClick={handleProductClick}>
      <Link to={`/product/${props.id}`}>
        <img className="item-image" src={props.image} alt="" />
      </Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">${props.new_price}</div>
        <div className="item-price-old">${props.old_price}</div>
      </div>
     
    </div>
  );
};

export default Item;
