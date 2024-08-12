const mongoose = require("mongoose");
//register all the required schemas for ref(avoiding MissingSchemaError: Schema hasn't been registered for model)
require('./agent');  
require('./carrier'); 
require('./user');  
require('./userAccount');  
require('./lob'); 

const policySchema = new mongoose.Schema({
    policyNumber: {
        type: String,
        required: true,
        trim:true
    },
    policyStartDate: {
        type: Date,
        required: true,
    },
    policyEndDate: {
        type: Date,
        required: true,
    },
    premiumAmountWritten: {
        type: Number
    },
    premiumAmount: {
        type: Number,
        required: true,
    },
    policyType: {
        type: String,
        required: true,
        trim:true
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
        required: true,
    },
    lob: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LOB",
        required: true,
    },
    carrier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carrier",
        required: true,
    },
},{timestamps:true});

module.exports = mongoose.model("Policy", policySchema);
