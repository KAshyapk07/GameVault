
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Shop from './Pages/Shop';
import Product from './Pages/Product'
import Shopcategory from './Pages/Shopcategory';
import Mostliked from './Pages/Mostliked';
import AdminPanel from './Pages/AdminPanel';
import Cart from './Pages/Cart';
import Loginsignup from './Pages/Loginsignup';
import Footer from './Components/Footer/Footer';



function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar />
      <Routes>

        <Route path='/' element={<Shop/>}/>
        <Route path='/mostpopular' element={<Shopcategory category="mostpopular"/>}/>
        <Route path='/mostliked' element={<Mostliked/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Loginsignup/>}/>
        <Route path='/admin' element={<AdminPanel/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
