import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    fullName: String,
    department: String,
    email: String,
    phone: String,
});

const employeeModel = mongoose.model('Employee', employeeSchema);

export default employeeModel;