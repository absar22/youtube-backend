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
    // TODO: Add compound unique index on subscriber + channel
// to prevent duplicate subscriptions at the database level later
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
    if(!channelId){
        throw new ApiError(400,'channelId required')
    }
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,'Invalid ChannelId')
    }

    const getSubscriber = await Subscription.aggregate([
        {
            $match: {
                  channel:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from:'users',
                localField:'subscriber',
                foreignField:'_id',
                as:'subscriberInfo'
            }
        },
        {
            $project:{
                "subscriberInfo.username": 1,
                "subscriberInfo.createdAt":1
                
            }
        }
    ])
    // TODO: Check whether channel exists separately
// so an empty subscriber list doesn't mean channel not found
    if(!getSubscriber?.length){
        throw new ApiError(404, 'channel doesnt exist')
    }
    return res.status(200).json(new ApiResponse(200, getSubscriber,'User channedl fetched successfully'))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!subscriberId){
        throw new ApiError(400,'SubscribedId is required')
    }
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,'Invalid SubscribedID')
    }
    const subscriberList = await Subscription.aggregate([
        {
            $match: {
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from:'users',
                localField:'channel',
                foreignField:'_id',
                as:'usersChannelInfo'
            }
        },
        {
            $unwind: '$usersChannelInfo'
        },
        {
            $sort:{
                createdAt: -1
            }
        },
        {
            $project: {
                username:'$usersChannelInfo.username'
            }
        }
    ])
    if(!subscriberList.length){
        return res.status(200).json(new ApiResponse(200,{},'No subscriber'))
    }
   
     return res.status(200).json(new ApiResponse(200,subscriberList,'subscriber llist feteched susscessfully'))

})

export {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels}