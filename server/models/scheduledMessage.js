const mongoose = require("mongoose");

const scheduledMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    scheduledDateTime: {
        type: Date,
        required: true,
    },
},{timestamps:true});

module.exports = mongoose.model("ScheduledMessage", scheduledMessageSchema);
