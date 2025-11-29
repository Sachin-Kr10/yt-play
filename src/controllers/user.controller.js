const asyncHandler = require("../utils/asynhandler");
const Apierror = require("../utils/apierror");
const User = require("../models/user.model");
const uploadOnCloudinary = require("../utils/cloudnary")
const Apiresponse = require("../utils/apiresponse")
const jwt =require("jsonwebtoken")

const genAccessandRefreshToken = async(userId)=>{
  try{
    await User.findById(userId);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken(0)
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false});

    return {accessToken,refreshToken}
  }
  catch(error){
    throw new Apierror(500, "something went wrong ")
  }
}


const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if ([fullname, email, username, password].some((field) => field?.trim() === "" )) {
    throw new Apierror(400, "All fields are required");
  }

  const existedUser =await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new Apierror(409, "User with Email or Username existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImagePath = req.files?.coverImage[0]?.path;

  let coverImagePath ;
  if(req.file && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
    coverImagePath= req.files.coverImage[0].path;
  }

  if(!avatarLocalPath){
    throw new Apierror(400, "AvatarLocal Image required");
  }


  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImagePath)

  if(!avatar){
    throw new Apierror(400, "Avatar Image required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createdUser){
    throw new Apierror(500, "Registration Failed");
  }

  return res.status(201).json(
    new Apiresponse(200, createdUser,"User Registered Successfully")
  )

});

const loginUser = asyncHandler(async (req,res)=>{
  const {username , email , password} = req.body;
  if(!username || !email){
    throw new Apierror(400, "username or email is required");
  }
  const user = await User.findOne({
    $or :[{username},{email}]
  })
  if(!user){
    throw new Apierror(404,"user not found");
  }
  const isPasswordValid =await user.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new Apierror(401,"Invalid Password");
  }
  const {accessToken,refreshToken} = await genAccessandRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).
  select("-password -refreshToken")

  const options = {
    httpsOnly : true ,
    secure : true,
  }
  return res.status(200)
  .cookie("accessToken",accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new Apiresponse(200,{
      user: loggedInUser,accessToken,refreshToken
    },
    "User Logged in successfully"
  ) )
})


const logoutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken: undefined
      }
    },{
      new : true
    }
  )

  const options = {
    httpsOnly :true,
    secure : true,
  }
  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",optins)
  .json(new Apiresponse(200, {},"User logout successfully"))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken
  if(incomingRefreshToken){
    throw new Apierror(401, "unauthorize request")
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    )
    const user = User.findById(decodedToken?._id)
  
    if(!user ){
      throw new Apierror(401,"Invlaid refresh Token")
    }
    if(incomingRefreshToken !== user?.refreshToken){
      throw new Apierror(401, "refresh token is expired ")
    }
    const options={
      httpsOnly : true,
      secure: true
    }
    const {accessToken,newrefreshToken }=await genAccessandRefreshToken(user._id)
  
    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshtoken", newrefreshToken,options)
    .json(
      new Apiresponse(200,
        {
          accessToken,
          refreshToken:newrefreshToken
        },"Acess Token refresh"
      )
    )
  } catch (error) {
      throw new Apierror(401,"Invalid refresh Token")
  }
})

module.exports = {registerUser,loginUser,logoutUser,refreshAccessToken};

