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
     if(!content){
        throw new ApiError(400, 'Please enter the content')
     }
     const createTweet = await Tweet.create({
        content,
        owner: user._id
     },
)
    const createdTweet =  await Tweet.findById(createTweet._id)
    if(!createdTweet){
        throw new ApiError(500, "Error fetching user's tweet")
    }
    return res.status(201).json(new ApiResponse(201, createdTweet, 'You tweeted '))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const findTweets = await Tweet.find({
        owner: req.params.userId
    })
    if(findTweets.length === 0){
        throw new ApiError(200, "Haven't tweet yet")
    }
    const totalTweetsCount = findTweets.length

    return res.status(200).json(new ApiResponse(200, 
         {
            tweets:findTweets, 
            count:totalTweetsCount
        },
         'Tweets fetched successfully'))

})

const updateTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    if(!content){
        throw new ApiError(400, 'Please put content')
    }
   const editedTweet = await Tweet.findByIdAndUpdate(req?.params?.tweetId, {
    $set: {
        content
    }
   })
   if(!editedTweet){
    throw new ApiError(400, 'User not existed')
   }
   return res.status(201).json(new ApiResponse(201, editedTweet.content, 'Tweet edited successfully'))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {createTweet,getUserTweets,updateTweet,deleteTweet}