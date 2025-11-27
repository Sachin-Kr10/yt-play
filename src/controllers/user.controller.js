const asyncHandler = require("../utils/asynhandler");
const Apierror = require("../utils/apierror");
const User = require("../models/user.model");
const uploadOnCloudinary = require("../utils/cloudnary")
const Apiresponse = require("../utils/apiresponse")


const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (
    [fullname, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new Apierror(400, "All fields are required");
  }

  const existedUser = user.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new Apierror(409, "User with Email or Username existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
    throw new Apierror(400, "Avatar Image required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const cover = await uploadOnCloudinary(coverImagePath)

  if(!avatar){
    throw new Apierror(400, "Avatar Image required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImagePath: cover?.url  || "",
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

module.exports = registerUser;

