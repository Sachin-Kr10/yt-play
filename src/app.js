const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
    orgin : process.env.CORS_ORIGIN,
    credentials : true
})) 
app.use(express.json({
    limit : "20kb"
}))
app.use(express.urlencoded({
    extended : true
}))
app.use(express.static("public"))
app.use(cookieParser())

//routes
const userrouter = require("./routes/user.routes")

app.use("/api/v1/users",userrouter);





module.exports = app;