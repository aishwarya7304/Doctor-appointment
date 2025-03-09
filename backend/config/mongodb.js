import mongoose from "mongoose";

const connectDB = async () => {

   const url = process.env.MONGODB_URI

   mongoose.connection.on('connected', () => console.log("Database Connected"))

   await mongoose.connect(`${url}/prescripto`);
}

export default connectDB