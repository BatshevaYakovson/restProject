import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import './App.css'
import Header from './comps/Header'
import AddRestaurant from './comps/RestaurantForm'
import AddTable from './comps/TableForm'
import AddOrder from './comps/OrderForm'
import Login from './comps/login'
import Home from './comps/HomePage'
import { AppContext } from './context/context';
import RestaurantDetails from './comps/RestaurantDetails'
import RestaurantManagementPage from './comps/RestaurantManagementPage'

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null) //maybe change

  return (
    <>
      <AppContext.Provider value={({ user, setUser })}>

        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Header />} />
          </Routes>
          <main className="flex-grow">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/*" element={<h2>Page 404</h2>} />
              <Route path="/add-restaurant" element={<AddRestaurant />} />
              <Route path="/add-table" element={<AddTable />} />
              <Route path="/make-order" element={<AddOrder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/restaurant/:id" element={<RestaurantDetails />} />
              <Route path="/restaurant-management" element={<RestaurantManagementPage />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AppContext.Provider >

    </>

  )
}

export default App
