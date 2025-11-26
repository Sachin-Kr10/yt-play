require('dotenv').config();
const connectDB = require("./db/index")
const app = require("./app");
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`http://localhost:3000`);
    })
})
.catch((err)=>{
    console.log("db connection failed")
})