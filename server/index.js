//importing necessary modules and packages
const express = require("express");
const app = express();
const routes = require("./routes/route");
const database = require("./config/database");
const dotenv = require("dotenv");
const {checkCpuUsage} = require("./cpuMonitor");

// Loading environment variables from .env file
dotenv.config();

//setting port number
const PORT = process.env.PORT || 4001 ;

//connecting database
database.connect();

app.use(express.json());
app.use("/",routes);

//Testing the server
app.get("/",(req,res) => {
    return res.json({
        success:true,
        message:"Your server is running..."
    });
});

//Litening to the server
app.listen(PORT, () => {
    console.log(`App running at ${PORT}`)
});

// Check CPU usage every minute
setInterval(checkCpuUsage, 60000);

