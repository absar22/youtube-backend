import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    const {content}= req.body
    if(!content){
        throw new ApiError(400, 'Invalid content')
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
 if(!content){
    throw new ApiError(400,'Content is required')
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
    // TODO: delete a comment
})

export {getVideoComments, addComment, updateComment,deleteComment}