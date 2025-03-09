import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

const MyAppointments = () => {

  const { backendURL, token } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const navigate = useNavigate()

  const getUserAppointments = async () => {
    try {
      
      const {data} = await axios.get(`${backendURL}/api/user/appointments`,{headers: {token}})
      
      if (data.success){
        setAppointments(data.appointments.reverse())
        // console.log(data.appointments)
      }

      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  
  const initPay = (order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response)

        try {
          
          const {data} = await axios.post(`${backendURL}/api/user/verify-Razorpay`, response, {headers:{token}})
          if(data.success){
            getUserAppointments()
            navigate('/my-appointments')
          }
          
        } catch (error) {
          console.log(error);
          toast.error(error.message)
          
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  }

  const cancelAppointment = async (appointmentId) => {
    if (!appointmentId) {
      console.error("Error: appointmentId is undefined or null!");
      toast.error("Invalid appointment ID!");
      return;
    }
  
    try {
      console.log("Sending appointmentId:", appointmentId); // Debugging
  
      const { data } = await axios.post(
        `${backendURL}/api/user/cancel-appointment`,
        { appointmentId: String(appointmentId) },  // Ensure it's a string
        { headers: { token } }  // Use Authorization header
      );
      
      console.log("Response:", data);
      
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };
  
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/payment-razorpay`,
        { appointmentId: String(appointmentId) },  // Ensure it's a string
        { headers: { token } }  // Use Authorization header
      );
      if (data.success) {
        initPay(data.order)
      }

  } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    
  }
    
  }
  
  useEffect(()=>{
    if (token) {
      getUserAppointments()
    }
  },[token])
  return (
    <div>
      <p>My appointments</p>
      <div>
        {appointments.map((item, index)=>(
          <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b">
          <div>
            <img className="w-36 bg-[#EAEFFF]" src={item.docData.image} alt=""/>
          </div>
          <div className="flex-1 text-sm text-[#5E5E5E]">
            <p className="text-[#262626] text-base font-semibold">{item.docData.name}</p>
            <p>{item.docData.speciality}</p>
            <p className="text-[#464646] font-medium mt-1">Address:</p>
            <p>{item.docData.address.line1}</p>
            <p>{item.docData.address.line2}</p>
            <p className="mt-1">
              <span className="text-sm text-[#3C3C3C] font-medium">Date & Time:</span>
              {item.slotDate} | {item.slotTime}
            </p>
          </div>
          {
            item.cancelled ?
            <div className='text-red-900 border-red-700'>
              Appointment Cancelled
            </div>
            : <div className="flex flex-col gap-2 justify-end text-sm text-center">
            {item.payment ? <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>:
            <button onClick={()=>appointmentRazorpay(String(item._id))}
              className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
            >
              Pay Online
            </button>}
            <button onClick={()=>cancelAppointment(String(item._id))}
              className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Cancel appointment
            </button>
          </div>
          }
        </div>
        
        ))}
      </div>
    </div>
  )
}

export default MyAppointments