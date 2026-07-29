import validator from "validator";

export function validateEmail(email){
    if (!email || email.trim() === "") {
         throw new Error("Email is required.");
        }
    //normalize
    email=email.trim();
    //validation
    if (!validator.isEmail(email)) {
        throw new Error("Please enter a valid email.");
    }
    return email;
}

export function validateUsername(username){
    if (!username || username.trim()==="") {
         throw new Error("username is required");
    }
    username = username.trim().toLowerCase();
    if (username.length < 2 || username.length > 50) {
        throw new Error("username must be between 2 and 50 characters.");
        }
    if (!/^[A-Za-z]+$/.test(username.trim())) {
        throw new Error("username must contain only letter");
    }
    return username;
}

export function validatePassword(password){
//password validation
        // Required
        // At least 8 characters
        // At most 64 or 128 characters (to prevent abuse while allowing password managers)
        // At least one uppercase letter
        // At least one lowercase letter
        // At least one digit
        // At least one special character
        // No leading/trailing spaces (or trim and reject if altered)
    if (!password || password.trim()==="") {
         throw new Error("password is required");
    };
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,64}$/;
     if (!passwordRegex.test(password)) {
         throw new Error( "Password must be 8-64 characters and include an uppercase letter, lowercase letter, number, and special character.");
    };
    return password;
}

export function validateOtp(otp){
     if(!otp || otp.trim()===""){
        throw new Error("otp is required");
    };
    otp=otp.trim();
    return otp;
}
