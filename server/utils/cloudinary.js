import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
  cloud_name: "ddlimoalj", 
  api_key: "484317881573547", 
  api_secret: "2OXvi6XQfZxty41zRyvmt5IPdk0"
});

const uploadOnCloudinary = async (localFilePath) => {
    //console.log(typeof localFilePath)
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        console.log('Hi')
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        //fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        console.log("Under Cloudinary.js File: " + error);
        return null;
    }
}



export {uploadOnCloudinary}