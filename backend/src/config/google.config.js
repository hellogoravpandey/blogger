import {OAuth2Client} from "google-auth-library";
import config from "./config.js";

const googleClient = new OAuth2Client(
    config.GOOGLE_OAUTH_AUTHENTICATION_CLIENT_ID,
    config.GOOGLE_OAUTH_AUTHENTICATION_CLIENT_SECRET,
    config.GOOGLE_OAUTH_AUTHENTICATION_CALLBACK_URL
)


export default googleClient;