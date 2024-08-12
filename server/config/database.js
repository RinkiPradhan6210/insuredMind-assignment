const mongoose = require("mongoose");
require("dotenv").config();

const {MONGODB_URL} = process.env ;

exports.connect = () => {
    mongoose.connect(MONGODB_URL)
    .then(console.log(`DB is connected`))
    .catch((err) => {
        console.log(`Db is not connected`);
        console.log(err);
        process.exit(1);
    })

}