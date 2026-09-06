import mongoose from "mongoose";
import config from "../src/config/config.js";
import User from "../models/user.models.js";

// const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminEmail = "collegegourav321@gmail.com"

if (!adminEmail) {
    throw new Error("ADMIN_EMAIL must be set before running the admin seed");
}

try {
    await mongoose.connect(config.MONGODB_URL);
    const user = await User.findOneAndUpdate(
        { email: adminEmail },
        { $set: { role: "ADMIN" } },
        { new: true, runValidators: true },
    ).select("username email role");

    if (!user) {
        throw new Error(`No user found for ADMIN_EMAIL=${adminEmail}`);
    }

    console.log(`Admin role assigned to ${user.email} (${user.username})`);
} finally {
    await mongoose.disconnect();
}