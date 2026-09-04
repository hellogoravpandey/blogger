import config from "./config.js"
import {Resend} from "resend"

const resend =  new Resend(config.RESEND_SECRET_KEY);

export default resend;