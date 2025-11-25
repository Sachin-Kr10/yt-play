const mongoose = require("mongoose");
import { DB_NAME } from "../constants";

const connectDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("mongo DB connected")
    }
    catch(error){
        console.log("DB connection error", error)
    }
}

export default connectDB;