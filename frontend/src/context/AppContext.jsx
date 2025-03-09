import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {
   const currencySymbol = '₹'

   const backendURL = import.meta.env.VITE_BACKEND_URL 
   
   const [doctors, setDoctors] = useState([])
   const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') :  false)
   const [userData, setUserData] = useState(false)

   const getDoctorsData = async () => {
      try {
         const {data} = await axios.get(`${backendURL}/api/doctor/list`)
         console.log(`${backendURL}/api/doctor/list`)
         if(data.success){
            // console.log(data.doctors)
            setDoctors(data.doctors)
         } else {
            toast.error(data.message)
         }
      } catch (error) {
         console.log(error)
         toast.error(error.message)
      }
   }
   
   const loadUserProfileData = async () => {
      try {
         
         const {data} = await axios.get(`${backendURL}/api/user/get-profile`, {headers: {token}})
         if (data.success) {
            setUserData(data.userData)
         } else {
            toast.error(error.message)
         }
         
      } catch (error) {
         console.log(error)
         toast.error(error.message)
      }
   }

   useEffect(()=>{
      getDoctorsData()
   },[])
   
   useEffect(()=>{
      if(token){
         loadUserProfileData()
      } else{
         setUserData(false)
      }
   },[token])

   const value ={
      doctors,
      currencySymbol,
      backendURL,
      getDoctorsData,
      token, setToken,
      userData, setUserData,
      loadUserProfileData
   }

   return(
      <AppContext.Provider value={value}>
         {props.children}
      </AppContext.Provider>
   )
}

export default AppContextProvider