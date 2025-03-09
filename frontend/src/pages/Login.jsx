import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const { backendURL, token, setToken } = useContext(AppContext)

  const [state, setState] = useState('Sign Up')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {

      if(state === 'Sign Up'){

        const {data} = await axios.post(`${backendURL}/api/user/register`, {name,password,email})
        if(data.success){
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else{
        
        const {data} = await axios.post(`${backendURL}/api/user/login`, {password,email})
        if(data.success){
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      }
      
      
    } catch (error) {
      console.log(error)
      toast.error(data.message)
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        {/* <!-- Title --> */}
        {
          state === 'Sign Up' &&
          <div>
            <p className="text-2xl font-semibold">Create Account</p>
            <p>Please sign up to book an appointment</p>
          </div>
        }
        {
          state === 'Login' &&
          <div>
            <p className="text-2xl font-semibold">Login</p>
            <p>Please Login to book an appointment</p>
          </div>
        }

        {/* <!-- Full Name Field --> */}
        {
        state === 'Sign Up' &&
            <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              required
              onChange={(e)=> setName(e.target.value)} value ={name}
            />
          </div>
        }

        {/* <!-- Email Field --> */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e)=> setEmail(e.target.value)} value ={email} 
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        {/* <!-- Password Field --> */}
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e)=> setPassword(e.target.value)} value ={password} 
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        {/* <!-- Submit Button --> */}
        {
           state === 'Sign Up' ?
        <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base" type='submit'>
          Create Account
        </button> :
        <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base" type='submit'>
          Login
        </button> 

        }

        {/* <!-- Login Redirect --> */}
        {
          state === "Sign Up" ? (       
             <p>
            Already have an account?
            <span onClick={()=>{setState('Login')}} className="text-primary underline cursor-pointer">Login here</span>
            </p>
            ) : (
              <p>
              Create a new account?
              <span onClick={()=>setState('Sign Up')} className="text-primary underline cursor-pointer">Sign Up here</span>
              </p>
            )
        }
      </div>
    </form>

  )
}

export default Login