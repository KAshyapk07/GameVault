import React, { useEffect, useState } from 'react';
import './Liked.css';
import Item from '../item/Item';

const Liked = () => {
  const [mostLikedProducts, setMostLikedProducts] = useState([]);

  // Fetch most liked products on component mount
  useEffect(() => {
    fetch(`/api/mostliked`)
      .then((response) => response.json())
      .then((data) => setMostLikedProducts(data))
      .catch((error) => console.error("Error fetching most liked products:", error));
  }, []);

  return (
    <div className='Mostliked'>
      <h1>MOST LIKED</h1>
      <hr />
      <div className="liked-item">
        {mostLikedProducts.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
            likes={item.likes} 
            fetchMostLiked={() => { // Pass function to refetch data
              fetch(`/api/mostliked`)
                .then((response) => response.json())
                .then((data) => setMostLikedProducts(data))
                .catch((error) => console.error("Error updating liked products:", error));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Liked;
