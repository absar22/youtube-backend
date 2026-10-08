import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if([name,description].some((fields) => fields.trim() === '')){
        throw new ApiError(400, 'All fields required')
    }
    const playlist = await Playlist.create({
        name:name.trim(),
        description:description.trim(),
        videos: [],
        owner: req?.user?._id
    })
    if(!playlist){
        throw new ApiError(404,'Playlist not found')
    }
 
    return res.status(201).json(new ApiResponse(201,playlist,'Playlist created succcessfully'))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!userId){
        throw new ApiError(400,'UserId is required')
    }
    if(!isValidObjectId(userId)){
        throw new ApiError(400,'Invalid userID')
    }
    const userPlaylist = await Playlist.find({owner:userId}).sort({createdAt:-1})
    return res.status(200)
    .json(new ApiResponse(200,userPlaylist, userPlaylist.length ? 
        'User playlist fetcched successfully':'This user has not created playlist yet'))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(400,'PlaylistId is required')
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError(404,'Invalid PlaylistId')
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(400,'No playlist found')
    }
    return res.status(200).json(new ApiResponse(200, playlist, 'Playlist by Id fetched successfully'))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
   
    const {playlistId, videoId} = req.params
    if(!playlistId || !videoId ){
        throw new ApiError(400,'Video and playlist Id required')
    }
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,'No valid Id')
    }
    const addVideo = await Playlist.findOneAndUpdate(
        {
            _id:playlistId,
            owner:req.user._id
        },
        {
            $addToSet: {
                videos:videoId
            }
        },
        {
            new:true,
            runValidators:true
        }
    )
    if(!addVideo){
        throw new ApiError(404,'playlist Not found')
    }
    return res.status(200).json(new ApiResponse(200,addVideo,'Video added successfully'))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId || !videoId){
        throw new ApiError(400,'All fields required')
    }
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,'Invalid playlist or video Id')
    }
    const deleteVideo = await Playlist.findOneAndUpdate(
        {
            _id:playlistId,
            owner:req.user._id
        },
        {
            $pull: {
                videos:videoId
            }
        },
        {
            new:true,
            runValidators:true
        }
    )
    if(!deleteVideo){
        throw new ApiError(404,'Video not found')
    }
    return res.status(200).json(new ApiResponse(200, deleteVideo, 'Video deleted successfulyl from playlist'))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId)
    throw new ApiError(400,'playlistId required')
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,'Invalid PlaylistId')
    }
    const deletePlaylist = await Playlist.findOneAndDelete(
        {
            _id:playlistId,
            owner:req.user._id
        }
    )
    if(!deletePlaylist){
        throw new ApiError(404,'Cannot delete Playlist')
    }
    return res.status(200).json(new ApiResponse(200,{},'Playlist Deleted Successfully'))
})


const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!playlistId){
        throw new ApiError(400,'PlaylistID required')
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,'Invalid PlaylistId')
    }
    if(!name?.trim() || !description?.trim()){
        throw new ApiError(400,'All fields required')
    }
    const update = await Playlist.findOneAndUpdate(
         {
            _id:playlistId,
            owner:req.user._id
         },
         {
            $set: {
                name:name.trim(),
                description:description.trim()
            }
         },
         {
            new:true,
            runValidators:true
         }
    )
    if(!update){
        throw new ApiError(404,'error updating playlist')
    }
    return res.status(200).json(new ApiResponse(200,update,'Playlist updated successfully'))
})

export {createPlaylist,getUserPlaylists,getPlaylistById,addVideoToPlaylist,removeVideoFromPlaylist,
    deletePlaylist,updatePlaylist
}