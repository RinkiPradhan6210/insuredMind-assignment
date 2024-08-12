const express = require("express");
const multer = require("multer");
const { Worker } = require("worker_threads");
const path = require("path");
const User = require("../models/user");
const Policy = require("../models/policy");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const {uploadFile, getPolicies, getAggregatedPoliciesByUser} = require("../controllers/controller");
const {messageSchedul} = require("../controllers/messageController");


router.post("/upload", upload.single("file"), uploadFile);

// Search for policies by username
router.get("/policy/:username", getPolicies);

// Aggregate policies by user
router.get("/aggregate-policies", getAggregatedPoliciesByUser);

// post-service for scheduled message
router.post("/scheduledMessage", messageSchedul);

//validation for route
router.all("/**", function(req,res){
    return res.json({
        suiccess:false,
        message:"Invalid end point "
    })
});

module.exports = router;
