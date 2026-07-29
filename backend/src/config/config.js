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
const config={
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    CRYPTO_SECRET: process.env.CRYPTO_SECRET,
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_EMAIL_REFRESH_TOKEN: process.env.GOOGLE_EMAIL_REFRESH_TOKEN,
    GOOGLE_EMAIL_USER: process.env.GOOGLE_EMAIL_USER
};

export default config;