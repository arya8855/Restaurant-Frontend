import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Analytics from './pages/Analytics';
import Table from './pages/Table';
import OrderTickets from './pages/OrderTickets';
import Menu from './pages/Menu'
import AppLayout from './pages/AppLayout';
import { FilterProvider } from './context/filterContext';


function App() {
  return (
    <BrowserRouter>
    <FilterProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/tables" element={<Table />} />
          <Route path="/ordertickets" element={<OrderTickets />} />
          <Route path='/menu' element={<Menu/>}/>   
        </Routes>
      </AppLayout>
    </FilterProvider>   
    </BrowserRouter>
  )
}

export default App