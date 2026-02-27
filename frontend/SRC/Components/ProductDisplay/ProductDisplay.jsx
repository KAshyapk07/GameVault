import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const [likes, setLikes] = useState(product.likes || 0);
    const [liked, setLiked] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleLike = async () => {
        try {
            const response = await fetch('http://localhost:4000/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id }),
            });
            const data = await response.json();
            if (data.success) {
                setLikes(data.likes);
                setLiked(true);
            }
        } catch (error) {
            console.error("Error liking the product:", error);
        }
    };

    const handleAddToCart = () => {
        addToCart(product.id);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 1500);
    };

    return (
        <div className="pd-container">
            {/* Image section */}
            <div className="pd-image-section">
                <div className="pd-main-image-wrap">
                    <img className="pd-main-image" src={product.image} alt={product.name} />
                </div>
                <div className="pd-thumb-row">
                    <img className="pd-thumb" src={product.image} alt="" />
                    <img className="pd-thumb" src={product.image} alt="" />
                    <img className="pd-thumb" src={product.image} alt="" />
                    <img className="pd-thumb" src={product.image} alt="" />
                </div>
            </div>

            {/* Info section */}
            <div className="pd-info">
                <h1 className="pd-title">{product.name}</h1>

                <div className="pd-stars">
                    <img src={star_icon} alt="star" />
                    <img src={star_icon} alt="star" />
                    <img src={star_icon} alt="star" />
                    <img src={star_icon} alt="star" />
                    <img src={star_dull_icon} alt="star" />
                    <span className="pd-reviews">(122 reviews)</span>
                </div>

                <div className="pd-price-block">
                    <span className="pd-price-new">${product.new_price}</span>
                    {product.old_price > 0 && (
                        <span className="pd-price-old">${product.old_price}</span>
                    )}
                    {product.old_price > product.new_price && (
                        <span className="pd-discount">
                            {Math.round(((product.old_price - product.new_price) / product.old_price) * 100)}% OFF
                        </span>
                    )}
                </div>

                <p className="pd-description">
                    Experience the thrill of <strong>{product.name}</strong>. Immerse yourself in stunning graphics and captivating gameplay.
                </p>

                <div className="pd-meta">
                    <div className="pd-meta-item">
                        <span className="pd-meta-label">Availability</span>
                        <span className="pd-meta-value pd-in-stock">In Stock</span>
                    </div>
                    <div className="pd-meta-item">
                        <span className="pd-meta-label">Likes</span>
                        <span className="pd-meta-value">{likes}</span>
                    </div>
                </div>

                <div className="pd-actions">
                    <button className="pd-btn-cart" onClick={handleAddToCart}>
                        {addedToCart ? '✓ Added!' : 'Add to Cart'}
                    </button>
                    <button className={`pd-btn-like ${liked ? 'pd-btn-liked' : ''}`} onClick={handleLike}>
                        {liked ? '♥ Liked' : '♡ Like'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDisplay;
