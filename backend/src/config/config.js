import dotenv from "dotenv"
dotenv.config();

if(!process.env.PORT){
    throw new Error(".env doesnot contains PORT")
}
if(!process.env.MONGODB_URL){
    throw new Error(".env  doesnot contain MONGODB_URL")
}
if(!process.env.JWT_SECRET){
    throw new Error(".env doesnot contains JWT_SECRET")
}
if(!process.env.GOOGLE_OAUTH_CLIENT_ID){
    throw new Error(".env doesnot contains GOOGLE_OAUTH_CLIENT_ID")
}
if(!process.env.GOOGLE_OAUTH_CLIENT_SECRET){
    throw new Error(".env doesnot contains GOOGLE_OAUTH_CLIENT_SECRET")
}
if(!process.env.GOOGLE_EMAIL_REFRESH_TOKEN){
    throw new Error(".env doesnot contains GOOGLE_EMAIL_REFRESH_TOKEN")
}
if(!process.env.GOOGLE_EMAIL_USER){
    throw new Error(".env doesnot contains GOOGLE_EMAIL_USER ")
}


// cloudinary variable exist?
if(!process.env.CLOUDINARY_CLOUD_NAME){
    throw new Error(".env doesnot contains CLOUDINAR_CLOUD_NAME")
}
if(!process.env.CLOUDINARY_API_KEY){
    throw new Error(".env doesnot contains CLOUDINAR_API_KEY")
}

if(!process.env.CLOUDINARY_API_SECRET){
    throw new Error(".env doesnot contains CLOUDINAR_SECRET_KEY")
}
if(!process.env.CLOUDINARY_URL){
    throw new Error(".env doesnot contains CLOUDINAR_URL")
}

const config={
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    CRYPTO_SECRET: process.env.CRYPTO_SECRET,
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_EMAIL_REFRESH_TOKEN: process.env.GOOGLE_EMAIL_REFRESH_TOKEN,
    GOOGLE_EMAIL_USER: process.env.GOOGLE_EMAIL_USER,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL
};

export default config;