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
                channel: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from:'Videos',
                localField:'channel',
                foreignField:'channel',
                as:'videos',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'owner',
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },{
                        $addFields: {
                            totalViews: {
                                $sum: '$videos.views'
                            },
                            totalLikes: {
                                $sum: '$videos.likes'
                            },
                            totalComments: {
                                $sum: '$videos.comments'
                            },
                            totalVideos: {
                                $size: '$videos'
                            }
                        }
                    },{
                        $addFields: {
                            totalSubscribers: {
                                $size: '$subscribers'
                            }
                        }
                    },{
                        $project: {
                            _id: 1,
                            name: 1,
                            avatar: 1,
                            totalViews: 1,
                            totalLikes: 1,
                            totalComments: 1,
                            totalVideos: 1,
                            totalSubscribers: 1
                        }
                    }
                ]
            }
        }
    ])
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {getChannelStats, getChannelVideos}