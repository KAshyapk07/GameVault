import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../item/Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopularProducts = () => {
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/popular`)
        .then((response) => response.json())
        .then((data) => setPopularProducts(data))
        .catch((error) => console.error("Error fetching popular products:", error));
    };
  
    fetchPopularProducts(); // Fetch immediately
    const interval = setInterval(fetchPopularProducts, 5000); // Fetch every 5 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

  return (
    <div className="popular">
      <h1>Most Popular</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
