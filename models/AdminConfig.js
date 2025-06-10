import mongoose from "mongoose";
 
const configSchema = new mongoose.Schema({
    siteLocations: [String],
    meetingLocations: [String],
    departments: [String],
});

const configModel = mongoose.model('AdminConfig', configSchema);

export default configModel;