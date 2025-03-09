import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, changeAvailablity } = useContext(AdminContext)

  useEffect(()=>{
    if (aToken) {
      getAllDoctors()
    }
  },[aToken])


  return (
<div className="m-5 max-h-[90vh] overflow-y-scroll">
  <h1 className="text-lg font-medium">All Doctors</h1>
  <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
    {/* <!-- Doctor Card Template --> */}
  {
    doctors.map((item, index)=>(
      <div key={index} className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group">
      <div className="bg-[#eaefff] group-hover:bg-primary transition-all duration-500 max-w-50 max-h-50 overflow-hidden">
      <img
        src={item.image}
        alt=""
      />
      </div>
      <div className="p-4">
        <p className="text-[#262626] text-lg font-medium">{item.name}</p>
        <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
        <div className="mt-2 flex items-center gap-1 text-sm">
          <input aria-label='' onChange={()=> changeAvailablity(item._id)}  type="checkbox" checked={item.available} />
          <p>Available</p>
        </div>
      </div>
    </div>
    ))
  }

  </div>
</div>
  )
}

export default DoctorsList