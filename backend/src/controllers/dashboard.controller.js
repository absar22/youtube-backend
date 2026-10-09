import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channel = await Subscription.aggregate([
        {
            $match: {
                channel : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
          $lookup: {
              from:'videos',
              localField:'channel',
              foreignField:'owner',
              as:'videos'
          } 
        }
    ])
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {getChannelStats, getChannelVideos}