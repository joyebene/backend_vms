import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

//Hash password before saving
adminSchema.pre('save', async function (next){
    if(!this.isModified('password')) 
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Match password method
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const adminModel = mongoose.model('Admin', adminSchema);

export default adminModel;
