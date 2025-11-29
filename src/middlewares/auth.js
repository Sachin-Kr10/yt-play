const Apierror = require("../utils/apierror")
const asyncHandler = require("../utils/asynhandler")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const verifyJWT= asyncHandler(async(req,res,next)=>{
   try {
     const token = req.cookies?.accessToken || req.header
     req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
     if(!token){
         throw new Apierror(401, "unauthorize request")
     }
     const decodedToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user =await User.findById(decodedToken?._id).select("-password - refreshToken ")
 
     if(!user){
         throw new Apierror(401, "Invalid Access Token");
     }
     req.user = user;
     next();
   } catch (error) {
        throw new Apierror(401, "Invalid Access Token");
   }
})

module.exports = verifyJWT
