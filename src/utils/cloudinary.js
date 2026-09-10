
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
//   CLOUDINARY_URL: process.env.CLOUDINARY_URL
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded succcesfully
        // console.log("File uploaded successfully on cloudinary:", response.url)
        fs.unlinkSync(localFilePath) // remove the local file after successful upload
        return response

    }catch(error){
        console.log("Error uploading file on cloudinary:", error)
        // remove locally saved temperory file as the upload operation failed
       fs.unlinkSync(localFilePath)
       return null
    }
}


export default uploadOnCloudinary