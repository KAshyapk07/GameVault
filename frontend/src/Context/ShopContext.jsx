import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);
const getDefaultCart=()=>{
    let cart ={};
    for(let index = 0; index < 300+1; index++){
        cart[index] =0;  
    }
    return cart;
}

const ShopContextprovider =(props)=>{
    const [all_product,setAll_product]= useState([]);
    const [cartItems,setCartitems]=useState(getDefaultCart());
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(()=>{
        fetch(`/api/allproducts`)
        .then((response)=>response.json())
        .then((data)=>setAll_product(data))
        .catch((err)=>console.error("Could not load products (is the backend running?):", err));

        if(localStorage.getItem('auth-token')){
            fetch(`/api/getcart`,{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json'
                },
                body:"",
            }).then((response)=>response.json())
            .then((data)=>setCartitems(data))
            .catch((err)=>console.error("Could not load cart:", err));

            // Check admin status
            fetch(`/api/isadmin`,{
                method:'GET',
                headers:{
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                },
            }).then((response)=>response.json())
            .then((data)=>setIsAdmin(data.isAdmin || false))
            .catch((err)=>console.error("Could not check admin status:", err));
        }
    },[]);
    
    const addToCart=(itemId)=>{
        setCartitems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        if(localStorage.getItem('auth-token')){
            fetch(`/api/addtocart`,{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',                 
                },
                body:JSON.stringify({"itemId":itemId})
            })
            .then((response)=>response.json());
        }
    }
    const removeFromCart=(itemId)=>{
        setCartitems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(localStorage.getItem('auth-token')){
            fetch(`/api/removefromcart`,{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            })
            .then((response)=>response.json());
        }
    }


    const getTotalCartAmount= ()=>{
        let totalAmount=0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = all_product.find((product)=>product.id===Number(item))
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = ()=>{
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem += cartItems[item];

            }
        }
        return totalItem;
    }

    const contextValue ={getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart,isAdmin,setIsAdmin}
    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextprovider;
