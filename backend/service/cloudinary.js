import cloudinary  from "../src/config/cloudinary.config.js";

export async function uploadImage(imagePath){
    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
        const upload=await cloudinary.uploader.upload(imagePath, options);    
        console.log(upload);
        return upload.public_id;
    } catch (error) {
        throw error;
    }
     
}


// deletion 

export async function deleteImage(publicId) {
    return await cloudinary.uploader.destroy(publicId);
}


