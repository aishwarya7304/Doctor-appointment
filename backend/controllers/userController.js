import validator from 'validator'
import bcrypt from 'bcryptjs'          //used to hash the pasword
import userModel from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/AppointmentModel.js'
import razorpay from 'razorpay'

// API to register user

export const registerUser = async (req,res) =>{
   try {
      
      const { name, email, password } = req.body
      if( !name || !password || !email){
         return res.json({success: false, message: "Missing Details"})
      }

      //validating email format
      if(!validator.isEmail(email)){
         return res.json({success: false, message: "enter a valid email"})
      }

      //validating strong password
      if(password.length<8){
         return res.json({success: false, message: "enter a strong password"})
      }

      //hashing user password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const userData = {
         name,
         email, 
         password : hashedPassword
      }
      
      const newUser = new userModel(userData)
      const user = await newUser.save()

      const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

      res.json({success:true, token})
   } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })    
      
   }
}

// API for user login
export const loginUser = async (req,res) => {
   try {
      
      const { email, password } = req.body
      const user = await userModel.findOne({email})
      
      if(!user){
         return res.json({ success: false, message:'User does not exist'})    
      }
      
      const isMatch = await bcrypt.compare(password, user.password)
      
      if(isMatch){
         const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
         return res.json({success:true, token})
      } else {
         return res.json({ success: false, message:'Invalid credentials'})    
      }

   } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })    
   }
}

//API to get user profile data

export const getProfile = async (req,res) => {
   
   try {
      
      const { userId } = req.body
      const userData = await userModel.findById(userId).select('-password')
      
      res.json({success:true,userData})
      
   } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })    
   }
}

// API to update user profile

export const updateProfile = async (req,res) => {
   
   try {
      
      const { userId, name, phone, address, dob, gender } = req.body
      const imageFile = req.file 
      
      if( !name || !phone || !address || !dob || !gender){
         return res.json({success:false, message:"Data Missing"})
      }

      await userModel.findByIdAndUpdate(userId, {name, phone, address: JSON.parse(address), dob, gender})
      
      if(imageFile){
         
         //upload image to cloudinary
         const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
         const imageURL = imageUpload.secure_url
         
         await userModel.findByIdAndUpdate(userId, {image: imageURL})
         
      }
      res.json({success:true,message:"Profile Updated"})

      
   } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })    
   }
}

//API to book appointment
export const bookAppointment = async (req, res) => {
   try {
      const { userId, docId, slotDate, slotTime } = req.body;

      if (!slotDate || typeof slotDate !== "string") {
         return res.json({ success: false, message: "Invalid slot date" });
      }

      const docData = await doctorModel.findById(docId).select('-password');

      if (!docData) {
         return res.json({ success: false, message: "Doctor not found" });
      }

      if (!docData.available) {
         return res.json({ success: false, message: 'Doctor not available' });
      }

      let slots_booked = docData.slots_booked || {}; // Ensure slots_booked is not null

      if (!slots_booked[slotDate]) {
         slots_booked[slotDate] = [];
      }

      if (slots_booked[slotDate].includes(slotTime)) {
         return res.json({ success: false, message: 'Slot not available' });
      }

      slots_booked[slotDate].push(slotTime);

      const userData = await userModel.findById(userId).select('-password');

      if (!userData) {
         return res.json({ success: false, message: "User not found" });
      }

      delete docData.slots_booked
      
      const appointmentData = {
         userId,
         docId,
         userData,
         docData,
         amount: docData.fees,
         slotTime,
         slotDate,
         date: Date.now()
      };

      const newAppointment = new appointmentModel(appointmentData);
      await newAppointment.save();

      // Save updated slots_booked
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });

      res.json({ success: true, message: 'Appointment Booked' });

   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
}

//APi to get user appointments for frontend my-appointments page

export const listAppointment = async (req,res) => {

   try {
      
      const {userId} = req.body
      const appointments = await appointmentModel.find({userId})

      res.json({success: true, appointments})
      
   } catch (error) {
      console.log(error)
      res.json({success: false, message: error.message})
   }
}


// API to cancel appointment

export const cancelAppointment = async (req,res) => {
   
   try {
      
      const {userId, appointmentId} = req.body
      const appointmentData = await appointmentModel.findById(appointmentId);

      console.log(appointmentData)
      //verify appointment user
      if(appointmentData.userId !== userId){
         return res.json({success:false, message: 'Unauthorized action'})
      }

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

const razorpayInstance = new razorpay ({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret:process.env.RAZORPAY_KEY_SECRET
})
//APi to make payment of appointment using razorpay

export const paymentRazorpay = async (req,res) =>{
   try {
   const {appointmentId} = req.body
   const appointmentData = await appointmentModel.findById(appointmentId)
   
   if(!appointmentData || appointmentData.cancelled){
      return res.json({success:false, message:"Appointment cancelled or not found"})
   }

   //creating options for razorpay payment
   
   const options = {
      amount: appointmentData.amount *100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
   }
   
   //creation of an order
   const order = await razorpayInstance.orders.create(options);
   
   res.json({success:true, order})
} catch (error) {
   console.log(error)
   res.json({success: false, message: error.message})
}

}

//API to verify payment of razorpay

export const verifyRazorpay = async (req,res) => {
   try {
      const {razorpay_order_id} = req.body
      const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

      if (orderInfo.status === 'paid') {
         await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
         res.json({success:true, message:"Payment Successful"})
      } else{
         res.json({success:false, message:"Payment failed"})
      }
   } catch (error) {
      console.log(error)
      res.json({success: false, message: error.message})
   }
}