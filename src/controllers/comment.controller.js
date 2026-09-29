import mongoose,  { isValidObjectId }from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!videoId){
        throw new ApiError(400,'VideoId required')
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,'Invalid videoId')
    }
    //  pagination formula
    const skip = (page - 1) * limit
    const comments = await Comment.aggregate(
        [
            {
                $match: {
                    video:new mongoose.Types.ObjectId(videoId)
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
            $limit: Number(limit)
           }
        ]
    )
    if(comments.length === 0){
        return res.status(200).json(
        new ApiResponse(200, [], 'No comments found for this video')
    )
    }
    return res.status(200).json(new ApiResponse(200, comments, 'ALL videos comment fetched succcessfully'))

})

const addComment = asyncHandler(async (req, res) => {
    const {content}= req.body
    const {videoId}= req.params
    if(!content){
        throw new ApiError(400, 'Invalid content')
    }
     if(!isValidObjectId(videoId)){
        throw new ApiError(400, 'Invalid videoId')
    }
    const createComment = await Comment.create({
        content,
         owner: req.user._id,
         video:req.params.videoId
    })
   
    const createdComment = await Comment.findById(createComment._id)
    if(!createdComment){
        throw new ApiError(500, 'Error fetching comment')
    }
    return res.status(200).json(new ApiResponse(200, createdComment, 'comment created successfully'))

})

const updateComment = asyncHandler(async (req, res) => {
 const {content}=req.body
 const {commentId}=req.params
 if(!content){
    throw new ApiError(404,'Content not found')
 }
 if(!isValidObjectId(commentId)){
    throw new ApiError(400, 'Invalid comment')
 }
 
 const updateComment = await Comment.findByIdAndUpdate(req?.params?.commentId, {
    $set: {
        content
    }
 }, {new:true})

 if(!updateComment){
    throw new ApiError(500, 'Server down')
 }
 
 return res.status(200).json(new ApiResponse(200, updateComment,'Comment updated'))
})
   

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId}= req.params
     if(!isValidObjectId(commentId)){
        throw new ApiError(400, 'Invalid comment')
    }
    const deleteComment = await Comment.findByIdAndDelete(req?.params?.commentId)
    if(!deleteComment){
        throw new ApiError(404,'comment cannot found')
    } 
       
    return res.status(200).json(new ApiResponse(200, {}, 'Comment deleted'))
})

export {getVideoComments, addComment, updateComment,deleteComment}