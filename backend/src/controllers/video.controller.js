import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User }from "../models/user.model.js"
import {ApiError} from '../utils/apiError.js'
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary,deleteAsset,deleteVideoFromCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if([title,description].some((fields) => fields?.trim() === '')){
        throw new ApiError(400,'All feilds are requied')
    }
    const videoLocalPath = req?.files?.videoFile[0]?.path
    const thumbnailLocalPath = req?.files?.thumbnail[0]?.path

      if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, 'Video and thumbnail are required')
    }
    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
     if (!videoFile || !thumbnail) {
    throw new ApiError(400, 'Video and thumbnail are not uploaded properly')
}
    const publishVideo = await Video.create({
        videoFile: {
            url: videoFile.secure_url,
            publicId: videoFile.public_id
        },thumbnail:{
            url: thumbnail.secure_url,
            publicId:thumbnail.public_id
        },
        owner: req?.user?._id,
        duration: videoFile.duration,
        title,
        description,
    })

    const publisedVideo = await Video.findById(publishVideo._id)
    if(!publisedVideo){
        throw new ApiError(500, 'Error publishing video')
    }
    return res.status(200).json(new ApiResponse(200, publisedVideo, 'Video publised successuflly'))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400,'VideoId required')
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,'Invalid videoId')
    }
    const videoIdUrl = await Video.findById(videoId)
    if(!videoIdUrl){
        throw new ApiError(404,'Video not found')
    }
    return res.status(200).json(new ApiResponse(200, videoIdUrl, 'Video fetched Successfully'))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title, description} = req.body
    if(!videoId){
        throw new ApiError(400,'VideoId is required')
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,'Invalid videoId')
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,'Video not found')
    }
    const thumbnailPublicId = video?.thumbnail?.publicId
    const localThumbnailPath = req?.file?.path
     if(!localThumbnailPath){
      throw new ApiError(400,'No thumbnail file path added') 
    }
    const thumbnail = await uploadOnCloudinary(localThumbnailPath)
    if(!thumbnail.secure_url || !thumbnail.public_id){
        throw new ApiError(400, 'Cannot upload thumbnail')
    }
    const updateVideo = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title,
            description,
            thumbnail: {
                url:thumbnail.secure_url,
                publicId:thumbnail.public_id
            }
        }
    },{new:true})
    if(!updateVideo){
        throw new ApiError(404,'Video not found')
    }
    if(thumbnailPublicId){
      await deleteAsset(thumbnailPublicId)
    }
    return res.status(200).json(new ApiResponse(200,updateVideo,'video update successfull'))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400,'VideoId is required')
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,'Invalid videoId')
    }
    
    const video = await Video.findByIdAndDelete(videoId)
    if(!video){
        throw new ApiError(404,'Video not found')
    }
     if(video?.videoFile?.publicId){
        await deleteVideoFromCloudinary(video.videoFile.publicId)
     }
     if(video?.thumbnail?.publicId){
        await deleteAsset(video.thumbnail.publicId)
     }
    return res.status(200).json(new ApiResponse(200,{},'Video Deleted successfully'))
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400,'videoID required')
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,'Invalid videoID')
    }
    const video = await Video.findById(videoId)
    video.isPublished = !video.isPublished   
    await video.save()

    return res.status(200).json(new ApiResponse(200,video,'Video Publised'))
})

export {getAllVideos,publishAVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus}