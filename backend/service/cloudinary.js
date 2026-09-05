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
        return {
            storageKey: upload.public_id,
            url: upload.secure_url,
            secure_url: upload.secure_url,
            public_id: upload.public_id,
        };
    } catch (error) {
        throw error;
    }
     
}


// deletion 

export async function deleteImage(publicId) {
    const storageKey = typeof publicId === "object"
        ? (publicId.storageKey || publicId.public_id)
        : publicId;
    return await cloudinary.uploader.destroy(storageKey);
}


