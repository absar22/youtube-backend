import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    // first se if the person is logged in or not 
     const user = await User.findById(req?.user?._id)
     if(!user){
        throw new ApiError(400, 'User not exist')
     }
     const {content } = req.body
     if(!content?.trim()){
        throw new ApiError(400, 'Please enter the content')
     }
     const createTweet = await Tweet.create({
        content:content.trim(),
        owner: user._id
     },
)
    const createdTweet =  await Tweet.findById(createTweet._id)
    if(!createdTweet){
        throw new ApiError(500, "failed to create tweet")
    }
    return res.status(201).json(new ApiResponse(201, createdTweet, 'tweet created successfully '))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId}= req.params
    if(!isValidObjectId(userId)){
       throw new ApiError(400, "Invalid user ID")
    }
    const tweets = await Tweet.find({
        owner: userId
    })
    .sort({
            createdAt:-1
        })
    return res.status(200).json(new ApiResponse(200, 
         {
            tweets, 
            count:tweets.length
        },
        tweets.length ? 'Tweets fetched successfully' : 'This user has not tweeted yet'))

})

const updateTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    const {tweetId}= req.params
    if(!content?.trim()){
        throw new ApiError(400, 'Please put content')
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet ID")
    }
   const editedTweet = await Tweet.findOneAndUpdate(
        {
            _id:tweetId,
            owner:req.user._id
        },
        {
            $set: {
                content:content.trim()
            }
        },{
            new:true,
            runValidators:true
        }
   )
   if(!editedTweet){
    throw new ApiError(404, 'Tweet not found')
   }
   return res.status(200).json(new ApiResponse(200, editedTweet.content, 'Tweet edited successfully'))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId}= req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet ID")
    }
    const deleteTweet = await Tweet.findOneAndDelete(
        {
            _id:tweetId,
            owner:req.user._id
        }
    )
    if(!deleteTweet){
        throw new ApiError(404, 'No tweet found')
    }
    return res.status(200).json(new ApiResponse(200, {}, 'Tweet deleted'))
})

export {createTweet,getUserTweets,updateTweet,deleteTweet}