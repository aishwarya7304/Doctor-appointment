import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

const Login = () => {

  
  const [state, setState] = useState('Admin')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const { aToken,setAtoken, backendURL } = useContext(AdminContext)
  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    try {

      if(state === 'Admin'){
    
        const { data } = await axios.post(backendURL + '/api/admin/login', { email, password })
        if(data.success){
          localStorage.setItem('aToken', data.token)
          setAtoken(data.token)
          console.log(data.token)
        } else {
          toast.error(data.message)
        } 

      } else{

      }
    } catch (error) {

    }
  }
  

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        {/* <!-- Admin Login Heading --> */}
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>

        {/* <!-- Email Input --> */}
        <div className="w-full">
          <p>Email</p>
          <input aria-label='email' onChange={(e) => setEmail(e.target.value)} value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
            placeholder="admin@prescripto.com"
          />
        </div>

        {/* <!-- Password Input --> */}
        <div className="w-full">
          <p>Password</p>
          <input aria-label='password' onChange={(e) => setPassword(e.target.value)} value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            placeholder='qwerty123'
            required
          />
        </div>

        {/* <!-- Login Button --> */}
        <button type="submit" 
          className="bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer">
          Login
        </button>

        {/* <!-- Alternate Login Option --> */}
    
      </div>
    </form>

  )
}

export default Login

