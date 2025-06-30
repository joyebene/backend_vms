import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
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
    agreed: String,
    checkOutTime: Date,
    checkInTime: Date,
    pics: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const visitorModel = mongoose.model('Visitor', visitorSchema);

export default visitorModel;