import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: {type: String, required: true},
    role: { type: String, required: true },

    groups: [{ type: String }],

    department: { type: String },
    siteLocation: { type: String },
    meetingLocation: { type: String },
    isActive: { type: Boolean, default: true },

    // Reset password
    resetToken: String,
    resetTokenExpiry: Date,

    // Refresh Token
    refreshToken: String,
    accessToken: String,
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
