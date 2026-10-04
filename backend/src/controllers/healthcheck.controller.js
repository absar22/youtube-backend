import { ApiError } from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import mongoose from 'mongoose' 

const healthcheck = asyncHandler(async (_, res) => {
   const dbStatus = mongoose.connection.readyState === 1
   if(!dbStatus)
      throw new ApiError(503,{database:'unhealthy'},'Api is unhealthy')
   
   return res.status(200).json(new ApiResponse(200,{database:'Healthy'}, 'Api is healthy!'))

})

export { healthcheck }
    