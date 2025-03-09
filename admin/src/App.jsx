import React from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';
import {AdminContext} from './context/AdminContext'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import DoctorsList from './pages/Admin/DoctorsList'
import AddDoctor from './pages/Admin/AddDoctor'

const App = () => {

  const {aToken} = useContext(AdminContext)
  
  return aToken?(
    <>
      <Navbar/>
      <ToastContainer/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element ={aToken? <></> : <Login/>}/>
          <Route path='/all-appointments' element ={<AllAppointments/>}/>
          <Route path='/doctor-list' element ={<DoctorsList/>}/>
          <Route path='/add-doctor' element ={<AddDoctor/>}/>
        </Routes>
      </div>
    </>
  ):(
    <div>
      <Login/>
      <ToastContainer/>
    </div>
  )
}

export default App 