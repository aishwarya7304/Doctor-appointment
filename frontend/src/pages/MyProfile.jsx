import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import {assets} from '../assets/assets.js'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

const MyProfile = () => {

  const { userData, setUserData, token, loadUserProfileData, backendURL } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image,setImage] = useState(false)

  const updateUserProfileData = async () => {

    try {
      
      const formData = new FormData()
      
      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender',userData.gender)
      formData.append('dob',userData.dob)

      image && formData.append('image',image)

      const {data} = await axios.post(`${backendURL}/api/user/update-profile`, formData,{headers:{token}})

      if(data.success){
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  return userData && (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
      {/* <!-- Image Section --> */}
      {
        isEdit ?
        <label htmlFor="image">
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image } alt="" />
            <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon } alt="" />
          </div>
          <input aria-label='' onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden />
        </label> :
        <img className="w-36 rounded" src={userData.image} alt="tr" />
      }

      {/* <!-- Name Section --> */}
      {
        isEdit ? <input className='bg-gray-200 text-center' type="text" value={userData.name} aria-label="lk" onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
          : <p className="font-medium text-3xl text-[#262626] mt-4">{userData.name}</p>
      }
      {/* <!-- Separator --> */}
      <hr className="bg-[#ADADAD] h-[1px] border-none" />

      {/* <!-- Contact Information Section --> */}
      <div>
        <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {
            isEdit ? <input className='bg-gray-200 text-center' type="text" value={userData.phone} aria-label="lk" onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
              : <p className="text-blue-500">{userData.phone}</p>
          }
          <p className="font-medium">Address:</p>
          {
            isEdit ? <input className='bg-gray-200 text-center' type="text" value={userData.address} aria-label="lk" onChange={e => setUserData(prev => ({ ...prev, address: e.target.value }))} />
              : <p className="text-gray-500">{userData.address.line1}<br />{userData.address.line2}</p>
          }
        </div>
      </div>

      {/* <!-- Basic Information Section --> */}
      <div>
        <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Gender:</p>
          {
            isEdit ? <input className='bg-gray-200 text-center' type="text" value={userData.gender} aria-label="lk" onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))} />
              : <p className="text-gray-500">{userData.gender}</p>
          }
          <p className="font-medium">Birthday:</p>
          {
            isEdit ? <input className='bg-gray-200 text-center' type="text" value={userData.dob} aria-label="lk" onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
              : <p className="text-gray-500">{userData.dob}</p>
          }
        </div>
      </div>

      {/* <!-- Edit Button --> */}
      <div className="mt-10 pr-5">
        {
          isEdit ? <button onClick={updateUserProfileData} className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all">
            Save Information
          </button>
            : <button onClick={() => setIsEdit(true)} className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all">
              Edit
            </button>
        }
      </div>
    </div>

  )
}

export default MyProfile