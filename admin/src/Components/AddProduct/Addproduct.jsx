import React, { useState } from 'react'
import './Addproduct.css'
import upload_area from '../../assets/upload_area.svg'

const Addproduct = () => {

  const [image,setImage] = useState(false);
  const[productDetails,setProductDetails] = useState({
    name:"",
    image:"",
    old_price:"",
    new_price:""
  })

  const imageHandler = (e)=>{
    setImage(e.target.files[0]);
  }
  const changehandler = (e) =>{
    setProductDetails({...productDetails,[e.target.name]:e.target.value})
  }


  const Add_product = async ()=>{
    let responseData;
    let product = productDetails;
    let formData = new FormData();
    formData.append('product',image);

    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/upload`,{
      method:'POST',
      headers:{
          Accept:'application/json'
      },
      body:formData,
    }).then((resp) => resp.json()).then((data)=>{responseData=data})
 

  if(responseData.success){
    product.image= responseData.image_url;
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/addproduct`,{
         method:'POST',
         headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
         } ,
        body:JSON.stringify(product),
  }).then((resp)=>resp.json()).then((data)=>{
    data.success?alert("Product Added"):alert("Failed")
  })
  }
}



  return (
    <div className="add-product">
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changehandler} type="text" name='name' placeholder='Type Here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changehandler} type="text" name='old_price' placeholder='Type Here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changehandler} type="text" name='new_price' placeholder='Type Here' />
                </div>
            </div>
          <div className="addproduct-itemfield">
            <label htmlFor="file-input">
              <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt="" />
            </label>
            <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
          </div>
          <button onClick={()=>{Add_product()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}
  
export default Addproduct
