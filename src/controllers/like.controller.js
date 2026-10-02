import {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

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
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {toggleCommentLike,toggleTweetLike,toggleVideoLike,getLikedVideos}