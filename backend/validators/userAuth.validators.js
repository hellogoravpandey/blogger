import validator from "validator";
import { ValidationError } from "../utils/errorHandler.utils.js";

export function validateEmail(email) {
  if (!email || email.trim() === "") {
    throw new ValidationError("Email is required.");
  }
  email = email.trim();
  if (!validator.isEmail(email)) {
    throw new ValidationError("Please enter a valid email.");
  }
  return email;
}

export function validateUsername(username) {
  if (!username || username.trim() === "") {
    throw new ValidationError("username is required");
  }
  username = username.trim().toLowerCase();
  if (username.length < 2 || username.length > 50) {
    throw new ValidationError("username must be between 2 and 50 characters.");
  }
  if (!/^[A-Za-z]+$/.test(username.trim())) {
    throw new ValidationError("username must contain only letter");
  }
  return username;
}

export function validatePassword(password) {
  if (!password || password.trim() === "") {
    throw new ValidationError("password is required");
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,64}$/;
  if (!passwordRegex.test(password)) {
    throw new ValidationError(
      "Password must be 8-64 characters and include an uppercase letter, lowercase letter, number, and special character.",
    );
  }
  return password;
}

export function validateOtp(otp) {
  if (!otp || otp.trim() === "") {
    throw new ValidationError("otp is required");
  }
  return otp.trim();
}
