import React, {useContext, useState} from 'react'
import './Navbar.css'
import logo from '../Assets/Logo.png'
import cart from '../Assets/Cart.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'


const Navbar = () => {

  const [menu,setMenu]= useState("home")
  const {getTotalCartItems, isAdmin} = useContext(ShopContext);

  return (
    <div className="navbar">
        <div className="nav-logo">
        <img src={logo} alt="" className="resize" />
          <p>GameVault</p>
        </div>
        <ul className="nav-menu">
          <li onClick={()=>{setMenu("home")}}><Link style={{textDecoration : 'none'}} to='/'>Home</Link>{menu==="home"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("most_popular")}}><Link style={{textDecoration : 'none'}} to='mostpopular'>Most Popular</Link>{menu==="most_popular"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("most_liked")}}><Link style={{textDecoration : 'none'}} to='mostliked'>Most Liked</Link>{menu==="most_liked"?<hr/>:<></>}</li>
          {isAdmin && (
            <li onClick={()=>{setMenu("admin")}}><Link className="admin-link" style={{textDecoration : 'none'}} to='/admin'>Admin</Link>{menu==="admin"?<hr/>:<></>}</li>
          )}
        </ul>
        <div className="login-cart">
          {localStorage.getItem('auth-token')
          ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
          :<Link style={{textDecoration : 'none'}} to='/login'><button>Login</button></Link>}
          
          <Link style={{textDecoration : 'none'}} to='/cart'><img src={cart} alt="" /></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>

        </div>
    </div>
  )
}
export default Navbar;