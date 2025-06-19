import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import SignIn from './pages/SignIn-Up/SignIn/SignIn'
import Register from './pages/SignIn-Up/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import ProductSection from './components/ProductSection/ProductSection'
import AddItemForm from './components/AddItemForm/AddItemForm'
import EditItemForm from './components/EditItemForm/EditItemForm'
import ProductDetails from './components/ProductSection/ProductDetails/ProductDetails '

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path='products' element={<ProductSection />} />
          <Route path='products/add' element={<AddItemForm />} />
          <Route path='products/:id' element={<ProductDetails/>} />
          <Route path='products/edit/:id' element={<EditItemForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
