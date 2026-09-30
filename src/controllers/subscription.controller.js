import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId){
      throw new ApiError(400,'ChannelId required')
    }
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,'Invalid ChannelId')
    }
    const isSubscribed = await Subscription.findOne({
          subscriber:req?.user?._id,
          channel: channelId
    })
    if(!isSubscribed){
        const createSubscription = await Subscription.create({
             subscriber:req?.user?._id,
          channel: channelId
        })
        return res.status(201).json(new ApiResponse(201,createSubscription,'Subscribed channel'))
    }else{
        await Subscription.deleteOne({
               subscriber:req?.user?._id,
          channel: channelId
        })
        return res.status(200).json(new ApiResponse(200,{},'Unscusbribed channel'))
    }
    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}