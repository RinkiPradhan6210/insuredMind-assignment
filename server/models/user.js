const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim:true
    },
    dob: {
        type: Date,
        required: true,
    },
    address: {
        type: String,
        trim:true
    },
    phone: {
        type: String,
        trim:true
    },
    state: {
        type: String,
        trim:true
    },
    zipCode: {
        type: String,
        trim:true
    },
    email: {
        type: String,
        trim:true
    },
    gender: {
        type: String
    },
    userType: {
        type: String,
        trim:true
    },
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
