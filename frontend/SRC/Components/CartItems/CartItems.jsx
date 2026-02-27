import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'

const CartItems = () => {
    const {getTotalCartAmount,all_product,cartItems,removeFromCart} =useContext(ShopContext);

    const hasItems = all_product.some((e) => cartItems[e.id] > 0);

  return (
    <div className="cart-page">
        <h2 className="cart-title">Your Cart</h2>

        {!hasItems && (
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <span>Browse our collection and add some games!</span>
          </div>
        )}

        {hasItems && (
          <>
            <div className="cart-items-list">
              {all_product.map((e)=>{
                if(cartItems[e.id]>0){
                  return(
                    <div className="cart-item-card" key={e.id}>
                      <img src={e.image} alt={e.name} className="cart-item-img"/>
                      <div className="cart-item-info">
                        <p className="cart-item-name">{e.name}</p>
                        <p className="cart-item-price">${e.new_price}</p>
                      </div>
                      <div className="cart-item-qty">
                        <span className="qty-label">Qty</span>
                        <span className="qty-value">{cartItems[e.id]}</span>
                      </div>
                      <div className="cart-item-total">
                        <span>${e.new_price * cartItems[e.id]}</span>
                      </div>
                      <img className="cart-item-remove" src={remove_icon} onClick={()=>{removeFromCart(e.id)}} alt="Remove" />
                    </div>
                  )
                }
                return null;
              })}
            </div>

            <div className="cart-bottom">
              <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>${getTotalCartAmount()}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span className="cart-free">Free</span>
                </div>
                <div className="cart-summary-divider"></div>
                <div className="cart-summary-row cart-summary-total">
                  <span>Total</span>
                  <span>${getTotalCartAmount()}</span>
                </div>
                <button className="cart-checkout-btn">Proceed to Checkout</button>
              </div>
              <div className="cart-promo">
                <p>Have a promo code?</p>
                <div className="cart-promo-box">
                  <input type="text" placeholder="Enter code" />
                  <button>Apply</button>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  )
}

export default CartItems