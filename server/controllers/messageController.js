const ScheduledMessage = require('../models/scheduledMessage');

exports.messageSchedul = async (req, res) => {
    const { message, day, time } = req.body;

    if (!message || !day || !time) {
        return res.status(400).send({ success: false, message: "Message, day, and time are required fields" });
    }

    // Convert the day and time into a valid date object
    const [dayPart, monthPart, yearPart] = day.split('-'); 
    const formattedDate = `${yearPart}-${monthPart}-${dayPart}`; 
    const scheduledDateTimeString = `${formattedDate}T${time}:00Z`; 
    const scheduledDateTime = new Date(scheduledDateTimeString); 

    // Check if the date is valid
    if (isNaN(scheduledDateTime.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid date or time format' });
    }

    try {
        
        const newMessage = new ScheduledMessage({ message, scheduledDateTime });
         await newMessage.save();
        res.status(201).json({ success: true, message: 'Message scheduled successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
