import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req,_,next) => {
    try {
         // used headers because if someone is using a different browser which donest use cookies or using from moblie applications 
        //  so  sometimes cookies are not sent so go grab token from headers because thats what we have sent 
         const token = req.cookies?.accessToken || req.headers?.authorization?.replace('Bearer ', "")
        if(!token) {
            throw new ApiError(401, "Unauthorized access")
        }
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, 'Invalid access token')
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid access')
    }
})