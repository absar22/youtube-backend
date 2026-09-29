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
        name,
        description,
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
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
   
    const {playlistId, videoId} = req.params
    if(!playlistId || !videoId && !videos){
        throw new ApiError(400,'Video and playlist Id required')
    }
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,'No valid Id')
    }
    const addVideo = await Playlist.findByIdAndUpdate(playlistId,{
          $addToSet: { // addtoSet is basical if not persendt then only add not liek $push
            videos:videoId
          }
    },{new:true})
    if(!addVideo){
        throw new ApiError(404,'Video Not found')
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
    const deleteVideo = await Playlist.findByIdAndDelete(playlistId,{
        $pull: {
            videos:videoId
        }
    })
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
    const deletePlaylist = await Playlist.findByIdAndDelete(playlistId)
    if(!deletePlaylist){
        throw new ApiError(404,'Cannot delete Playlist')
    }
    return res.status(200).json(new ApiResponse(200,{},'Playlist Deleted Successfully'))
})


const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}