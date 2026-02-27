import React, { useEffect,useState } from 'react'
import './Listproduct.css'
import cross_icon from '../../assets/cross_icon.png'

const Listproduct = () => {
 
  const [allproducts,setAllProducts] = useState([]);
  
  const fetchInfo = async ()=>{
    await fetch(`/api/allproducts`)
    .then((res)=>res.json())
    .then((data)=>{
      setAllProducts(data)
    });
  }
  useEffect(()=>{
    fetchInfo();
  },[])

  const remove_product= async (id)=>{
    await fetch(`/api/removeproduct`,{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo();
  }

  return (<>
    <div className="list-product">
        <h1> All Products List</h1>
        <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Old Price</p>
          <p>New Price</p>
          <p>Remove</p>
        </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,index)=>{
          return <div key={index} className="listproduct-format-main listproduct-format">
              
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>   
              <p>${product.new_price}</p>    
              <img onClick={()=>{remove_product(product.id)}} src={cross_icon} alt="" className="listproduct-remove-icon" />   
            </div>
        })}
      </div>
    </div>
    <hr />
    </>
  )
}

export default Listproduct
