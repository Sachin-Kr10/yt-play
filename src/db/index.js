const mongoose = require("mongoose");
require('dotenv').config();
const DB_NAME = require("../constants");

const connectDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("mongoDB connected")
    }
    catch(error){
        console.log("DB connection error", error)
    }
}

module.exports = connectDB;