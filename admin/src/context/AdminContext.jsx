import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

   const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '' )
   const [doctors, setDoctors] = useState([])
   const [appointments, setAppointments] = useState([])

   const backendURL = import.meta.env.VITE_BACKEND_URL 

   const getAllDoctors = async () => {
      try {
         const {data} = await axios.post(`${backendURL}/api/admin/all-doctors` , {}, {headers : {aToken} })

         if(data.success){
            // console.log(data.doctors)
            setDoctors(data.doctors)
         } else {
            toast.error(data.message)
         }
      } catch (error) {
         console.log('ithe gadbad')
         toast.error(error.message)
      }
   }

   const changeAvailablity = async (docId) => {
      try {
         
         const { data } = await axios.post(backendURL + '/api/admin/change-availablity', {docId}, {headers: {aToken}})
         if(data.success){
            toast.success(data.message)
            getAllDoctors()
         } else{
            toast.error(data.message)
         }

      } catch (error) {
         toast.error(error.message)
      }
   }
   
   const getAllAppointments = async () => {
      try {
         const {data} = await axios.get(`${backendURL}/api/admin/appointments`, {headers: {aToken}})
         if(data.success){
            console.log(data.appointments)
            setAppointments(data.appointments)
         } else{
            toast.error(error.message)
         }
      } catch (error) {
         toast.error(error.message)
      }
   
   }
   const cancelAppointment = async (appointmentId) => {
      try {
         const {data} = await axios.post(`${backendURL}/api/admin/cancel-appointment`,{appointmentId}, {headers: {aToken}})
         if(data.success){
            toast.success(data.message)
            getAllAppointments()
         } else{
            toast.error(error.message)
         }
      } catch (error) {
         toast.error(error.message)
      }
   }
   

   const value = {
      aToken , setAToken, 
      backendURL, doctors, getAllDoctors,
      changeAvailablity, 
      appointments, setAppointments, getAllAppointments, cancelAppointment
   }

   return(
      <AdminContext.Provider value = {value}>
         {props.children}
      </AdminContext.Provider>
   )
}

export default AdminContextProvider