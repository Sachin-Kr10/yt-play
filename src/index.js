const mongoose = require*("mongoose")
const express = requie("express")
import { DB_NAME } from "./constants";
const app = express();

;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        app.on("error",(error)=>{
            console.log("ERROR ", error )
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log("https://localhost:3000");
        })
    }
    catch(error) {
        console.log("ERROR", error)
        throw err
    }
})()