import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadImage = async (imagePath) => {

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      const result = await cloudinary.uploader.upload(imagePath, options);
      fs.unlinkSync(imagePath);
      return result.secure_url;
    } catch (error) {
      fs.unlinkSync(imagePath);
      console.error(error);
    }
};

export {uploadImage}
