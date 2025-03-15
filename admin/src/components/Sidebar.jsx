import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

   const { aToken } = useContext(AdminContext)

   return (
      <div className="min-h-screen bg-white border-r">
         {
            aToken && <ul className="text-[#515151] mt-5">
               <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-black' : ''}`} to={'/all-appointments'}>
                  <img className="min-w-5" src={assets.appointment_icon} alt="" />
                  <p className="hidden md:block">Appointments</p>
               </NavLink>
               <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-black' : ''}`} to={'/add-doctor'}>
                  <img className="min-w-5" src={assets.add_icon} alt="" />
                  <p className="hidden md:block">Add Doctor</p>
               </NavLink>
               <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-black' : ''}`} to={'/doctor-list'}>
                  <img className="min-w-5" src={assets.people_icon} alt="" />
                  <p className="hidden md:block">Doctor List</p>
               </NavLink>
            </ul>
         }
      </div>

   )
}

export default Sidebar