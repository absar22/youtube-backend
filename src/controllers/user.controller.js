import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/apiError.js'
import {User} from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/apiResponse.js'
import jwt from "jsonwebtoken"

const cookiesOptions = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async(userId) => {
try {
    const user =  await User.findById(userId)
       const accessToken =  await user.generateAccessToken()
       const refreshToken = await user.generateRefreshToken()
       user.refreshToken = refreshToken
       await user.save({validateBeforeSave:false})
       return {accessToken,refreshToken}
    
} catch (error) {
    throw new ApiError(500, "Something went wrong while generateing refresh and access token")
}
}

const registerUser  = asyncHandler(async (req,res) => {
    // get user details from frontend
    // validate user details
    // check if user already exists: using email or username
    // check for images , checks for avatar
    // upload to cloudinary
    // create user in object- create entry in db
    // remove password and refresh token filed from response
    // check for user creation 
    // return res
    const {username,email,fullname, password} = req.body
    console.log(req.body)

    if([username,email,fullname,password].some((fields) => fields?.trim() === '')){
       throw new ApiError(400,'All fields are required')
    }
   
    const existingUser = await User.findOne({
        $or:[
            {email},
            {username}
        ]
    })
    if(existingUser){
        throw new ApiError(409, 'User already exists')
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    console.log(avatarLocalPath)
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
   let coverImageLocalPath
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
   }

    if(!avatarLocalPath){
        throw new ApiError(400, 'Avatar is required')
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(500, 'Error uploading Avatar')
    }
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: avatar?.url,
        coverImage: coverImage?.url || ""
    })


     const createdUser = await User.findById(user._id).select('-password -refreshToken')
     if(!createdUser){
         throw new ApiError(500, 'Error fetching created user')
     }
     
     return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req,res) => {
// // req body 
// // username or email
// // find the usere
// // password check
// // refresth token and accesstoken
// // send these in cookies

 const{username,email,password} = req.body
 if(!username && !email){
     throw new ApiError(400, 'username or email is required')
 }
 

     const user = await User.findOne({
         $or:[{username}, {email}]
     }
     )

   if(!user){
     throw new ApiError(404, 'User not existited')
   } 

   const isPasswordValid =  await user.isPasswordCorrect(password) 

    if(!isPasswordValid){
     throw new ApiError(401, 'invalid user crediantials')
   }  

   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
     
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

   res.status(200).cookie('accessToken', accessToken,cookiesOptions).cookie('refreshToken', refreshToken,cookiesOptions)
   .json(new ApiResponse(201,  {user: loggedInUser, accessToken, refreshToken}, 'Account logged successfully'))
})


const logoutUser = asyncHandler(async(req,res) => {
   await User.findByIdAndUpdate(req.user._id, {
    $set: {refreshToken: undefined}
   })
 
   res.status(200)
   .clearCookie('accessToken', cookiesOptions)
   .clearCookie('refreshToken', cookiesOptions)
   .json(new ApiResponse(200, {}, 'Logged out successfully'))
})

const refreshAccessToken = asyncHandler(async(req,res) => {
    // i can take token from cookies because there is where i have saved it
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    // is token is not present
    if(!incomingRefreshToken){
        throw new ApiError(401, 'Refresh token is required')
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        //   check if decodedToken is valid
        if(!decodedToken){
            throw new ApiError(401, 'Invalid refresh token')
        }
        const user = await User.findById(decodedToken._id).select('-password -refreshToken')
        if(!user){
            throw new ApiError(404, 'Usesr not found')
        }
    
        if(incomingRefreshToken !== user.refreshToken ){
            throw new ApiError(403, 'Invalid refresh token')
        }
  
        // if refresh token is valid genearte a new access and refresh token 
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

        res.status(200).cookie('accessToken', accessToken, cookiesOptions).cookie('refreshToken', refreshToken, cookiesOptions)
            .json(new ApiResponse(200 , {accessToken,refreshToken}, 'Access token refreshed successfully'))
    } catch (error) {
        throw new ApiError(500, 'Internal Server Error')
    }

})


export {registerUser, loginUser, logoutUser, refreshAccessToken}