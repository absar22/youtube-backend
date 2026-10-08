import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,'VideoId required')
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,'Invalid videoId')
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,'Video not found')
    }
    const likedVideo = await Like.findOne({
        video:videoId,
        likedBy:req?.user?._id
    })
    if(!likedVideo){
        const like = await Like.create({
        video:videoId,
        likedBy:req?.user?._id
        })
        return res.status(201).json(new ApiResponse(201,like,'Liked video'))
    }else{
        await Like.deleteOne({
        video:videoId,
        likedBy:req?.user?._id
        })
        return res.status(200).json(new ApiResponse(200,{},'Deleted video'))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!commentId){
        throw new ApiError(400,'CommentId is requierd')
    }
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,'Invaid commentId')
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,'No comment found')
    }
    const commentLike = await Like.findOne({
        comment:commentId,
        likedBy:req?.user?._id
    })
    if(!commentLike){
        const like = await Like.create({
        comment:commentId,
        likedBy:req?.user?._id
        })
        return res.status(201).json(new ApiResponse(201,like,'Liked commment'))
    }else{
        await Like.deleteOne({
        comment:commentId,
        likedBy:req?.user?._id
        })
        return res.status(200).json(new ApiResponse(200,{},'unlike comment '))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400,'TweetId required')
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,'invalid tweetId')
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,'Tweet not found')
    }
    const likedTweet = await Like.findOne({
        tweet:tweetId,
        likedBy:req?.user?._id
    })
    if(!likedTweet){
        const like = await Like.create({
        tweet:tweetId,
        likedBy:req?.user?._id 
        })
        return res.status(201).json(new ApiResponse(201,like,'Tweet liked'))
    }
    await Like.deleteOne({
        tweet:tweetId,
        likedBy:req?.user?._id
    })
    return res.status(200).json(new ApiResponse(200,{},'tweet unlike'))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const {page = 1,limit = 10} =req.query
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    if(!Number.isInteger(pageNumber) ||pageNumber < 1 || !Number.isInteger(limitNumber) ||limitNumber < 1){
        throw new ApiError(400,'Invalid page or limit number')
    }
    const skip = (pageNumber - 1) * limitNumber

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy:req?.user?._id
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip:skip
        },
        {
            $limit: limitNumber
        },
 
        {
            $lookup:{
                from:'videos',
                localField:'video',
                foreignField:'_id',
                as:'likedVideos'
            }
        },
        {
             $unwind: "$likedVideos"
        },
        {
            $replaceWith: "$likedVideos"
        },
    ])
      return res.status(200).json(new ApiResponse(200,likedVideos,"Liked videos fetched successfully"))
})

export {toggleCommentLike,toggleTweetLike,toggleVideoLike,getLikedVideos}