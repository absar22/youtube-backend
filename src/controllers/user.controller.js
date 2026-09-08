import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/apiError.js'
import {User} from '../models/user.model.js'
const registerUser  = asyncHandler(async (req,res) => {
    // get user details from frontend
    // validate user details
    // check if user already exists: using email or username
    // check for images , checks for avatar
    // upload to cloudinary
    // create user in object- create entry in db
    const {username,email,fullname, password} = req.body
    console.log(req.body)
    if([username,email,fullname,password,avatar,coverImage].some((fields) => fields === '')){
       throw new ApiError(400,'All fields are required')
    }
    if(!req.files?.avatar[0]){
        throw new ApiError(401, 'Avatar is required')
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

    const avatar = req.files.avatar[0]
    const coverImage = req.files.coverImage[0]

    

})


export {registerUser}