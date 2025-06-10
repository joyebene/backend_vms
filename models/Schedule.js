import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    visitorCategory: {type: String, default: 'visitor'},
    siteLocation: String,
    meetingLocation: String,
    department: String,
    hostEmployee: String,
    visitStartDate: Date,
    visitEndDate: Date,
    purpose: String,
    createdAt: { type: Date, default: Date.now }
});

const scheduleModel = mongoose.model('Schedule', scheduleSchema);

export default scheduleModel;