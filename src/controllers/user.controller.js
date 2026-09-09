import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/apiError.js'
import {User} from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/apiResponse.js'

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

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(401, 'Avatar is required')
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


export {registerUser}