import validator from "validator"
import bycrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken"
import { error } from "console"
import appointmentModel from "../models/AppointmentModel.js"

//API for adding doctor
export const addDoctor = async (req, res) => {
   try {

      const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
      const imageFile = req.file

      //checking all data
      if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
         return res.json({ success: false, message: "Missing Details" })
      }

      //validating email format
      if (!validator.isEmail(email)) {
         return res.json({ success: false, message: "Please enter a valid email" })
      }

      //validating strong password
      if (password.length < 8) {
         return res.json({ success: false, message: "Please enter a strong password" })
      }

      //hashing doctor password
      const salt = await bycrypt.genSalt(10)
      const hashedPassword = await bycrypt.hash(password, salt)

      //upload image to cloudinary
      // console.log(imageFile.path)
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
      const imageUrl = imageUpload.secure_url

      const doctorData = {
         name,
         email,
         image: imageUrl,
         password: hashedPassword,
         speciality,
         degree,
         experience,
         about,
         fees,
         address: JSON.parse(address),
         date: Date.now()
      }

      const newDoctor = new doctorModel(doctorData)
      await newDoctor.save()

      res.json({ success: true, message: "Doctor Added" })

   }

   catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
   }
}


//API for admin login

export const loginAdmin = async (req, res) => {
   try {

      const {email, password} = req.body

      if(email === process.env.ADMIN_EMAIL &&  password=== process.env.ADMIN_PASSWORD ){

         const token = jwt.sign(email+password, process.env.JWT_SECRET)
         res.json({success:true,token})

      } else{
         res.json({success: false, message:"Invalid credentials"})
      }
   }

   catch (error) {
      console.log(error)
      console.log('idhar fassa')
      res.json({ success: false, message: error.message })
   }
}

// API to get all doctors list for admin panel

export const allDoctors = async (req,res) => {
   try {

      const doctors= await doctorModel.find({}).select('-password')   // does not provide password
      res.json({success : true, doctors})
       
   } catch (error) {
      console.log(error)
      console.log('here gadbad')
      res.json({ success: false, message: error.message })
   }
}

//API to get all appointments list
export const appointmentsAdmin = async (req, res) => {
   
   try {
      const appointments = await appointmentModel.find({})
      res.json({success:true, appointments})
   } catch (error) {
      console.log(error)
      res.json({success: false, message:error.message })
   }

}

//API for appointment cancellation
export const appointmentCancel = async (req,res) => {
   
   try {
      
      const {appointmentId} = req.body
      const appointmentData = await appointmentModel.findById(appointmentId);

      console.log(appointmentData)

      await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
      
      //releasing doctor slot

      const {docId, slotDate, slotTime} = appointmentData

      const doctorData = await doctorModel.findById(docId)

      let slots_booked = doctorData.slots_booked

      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

      await doctorModel.findByIdAndUpdate(docId, {slots_booked})

      // await appointmentModel.findByIdAndDelete(appointmentId)

      res.json({success: true, message: 'Appointment Cancelled'})

   } catch (error) {
      console.log(error)
      res.json({success: false, message: error.message})
   }
}