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
    //  TODO OLD image to be deleted by using a utility funtion
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
        new ApiResponse( 201, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req,res) => {

 const{username,email,password} = req.body
//  if(!username && !email){
//      throw new ApiError(400, 'username or email is required')
//  }
 if(!(username || email)){
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
   .json(new ApiResponse(200,  {user: loggedInUser, accessToken, refreshToken}, 'Account logged successfully'))
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
    // which user is sending 
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    // is token is not present
    if(!incomingRefreshToken){
        throw new ApiError(401, 'Refresh token is required')
    }
    try {
        //  verify refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
      
        // find user from token
        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(404, 'User not found')
        }
        // compare client token and db token
        if(incomingRefreshToken !== user.refreshToken ){
            throw new ApiError(403, 'refresh token is expired ')
        }
  
        // if refresh token is valid genearte a new access and refresh token 
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)

        return res.status(200)
        .cookie('accessToken', accessToken, cookiesOptions)
        .cookie('refreshToken', newRefreshToken, cookiesOptions)
         .json(new ApiResponse(200 , {accessToken, newRefreshToken}, 'Access token refreshed successfully'))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req,res) => {
  const {oldPassword,newPassword, confirmNewPassword} = req.body
  if(newPassword !== confirmNewPassword){
    throw new ApiError(404, 'New password and confirm password do not match')
  }
//    just because we want to change the password i am assuming you are logged in so we get req.user from auth middleware
     const user = await User.findById(req?.user?._id)
     if(!user){
        throw new ApiError(400, 'User not found')
     }
     const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
      if(!isPasswordCorrect){
        throw new ApiError(400, 'Invalid old password')
     }

     user.password = newPassword
     await user.save({validateBeforeSave:false})
     return res.status(201)
     .json(new ApiResponse(201,{},'Password changed successfully'))
})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res.status(200)
    .json(new ApiResponse(200, req.user,'User fetched successfully'))
})

const updateUser = asyncHandler(async(req,res) => {
 const {fullname,email} = req.body
 if(!(fullname || email)){
    throw new ApiError(400, 'All fields are nesseary')
 }
 const user = await User.findByIdAndUpdate(req?.user?._id, {
    $set:{
        fullname,
        email
    }
 },{new:true}).select('-password')

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))

})

const updateAvatar = asyncHandler(async(req,res) => {
    // find local path with the hlep of req.file which is given buy multer 
     const localAvatarPath =  req?.file?.path
     if(!localAvatarPath){
        throw new ApiError(400, 'Avatar file is missing')
     }
    //  upload that url to cloudinary
     const avatar =  await uploadOnCloudinary(localAvatarPath)
     if(!avatar.url){
           throw new ApiError(400, 'Error while uploading Avatar')
     }
    //  find user to update that url withe help of unique id and req.user which is given by auth middleware
    const user =  await User.findByIdAndUpdate(req?.user?._id, {
        $set: {
            avatar: avatar.url
        }
    },{new:true}).select('-password')

    // return res
    return res.status(200).json(new ApiResponse(200, user, 'Avatar changed successfully'))
})

const updateCoverImage = asyncHandler(async(req,res) => {
    const localCoverImagePath = req?.file?.path
    if(!localCoverImagePath){
        throw new ApiError(400, 'Cover Image is invalid')
    }
    const coverImage = await uploadOnCloudinary(localCoverImagePath)
    if(!coverImage.url){
           throw new ApiError(400, 'Error while uploading coverimage')
    }
    const user = await User.findByIdAndUpdate(req?.user?._id, {
        $set:{
            coverImage: coverImage.url
        }
    },{new:true}).select('-password')

    return res.status(200).json(new ApiResponse(200, user, 'Cover image updated successfully'))
})

const getUserChannelProfile =  asyncHandler(async(req,res) => {
    const {username} = req.params   // get username from url
    if(!username?.trim()){
        throw new ApiError(400, 'username is missing')
    }
    const channel = await User.aggregate([
        {
          $match:{
            username: username?.toLowerCase()
          }  
        },{
            $lookup:{
                from: 'subscriptions',
                localField: '_id',
                foreignField:'channel',
                as: 'subscribers'
            }
        }, {
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField:'subscriber',
                as: 'subscribedTo'
            }
        },
        {
            $addFields: {
                subscribersCount: {
                  $size: '$subscribers'
                },
                channelsSubscribedToCount: {
                    $size: '$subscribedTo'
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req?.user?._id, '$subscribers.subscribe']},
                        then: true,
                        else: false
                    }
                }
            }
        },{
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                createdAt: 1
            }
        }
    ])
    if(!channel?.length){
        throw ApiError(400, 'channel doesnt exist')
    }
    return res.status(200).json(new ApiResponse(200, channel[0], 'User channel fetched successfully'))
})

export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, 
    getCurrentUser, updateUser, updateAvatar, updateCoverImage, getUserChannelProfile
}