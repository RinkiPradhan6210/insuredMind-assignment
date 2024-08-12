const { Worker } = require("worker_threads");
const path = require("path");
const userModel = require("../models/user");
const policyModel = require("../models/policy");
function runWorker(filePath,fileName) {
    
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, "../worker"), {
            workerData: { filePath,fileName },
        });
        
        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

exports.uploadFile = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    runWorker(file.path, file.originalname)
        .then((result) => res.send(result))
        .catch((err) => res.status(500).send(err.message));
};

//// Search for policies by username
exports.getPolicies = async (req,res) => {
    try {
        const username =  req.params.username ;
        if(!username){
            return res.status(400).send({
                success:false,
                message:"User Name is required"
            });
        }
    const user = await userModel.findOne({ firstName: username});
    if (!user) {
        return res.status(404).send({success:false,
            message:"User not found"});
    }

    const policies = await policyModel.find({ user: user._id }).populate("agent").populate("carrier").populate("lob");
    res.status(200).send({sucess:true,data:policies});
} catch (error) {
    console.log(error);
    res.status(500).send({sucess:false, message:error.message});
}

};

//fetch palicies of each user 
exports.getAggregatedPoliciesByUser = async (req, res) => {
    try {
        const aggregatedData = await policyModel.aggregate([
            {
                $group: {
                    _id: "$user", 
                    totalPremium: { $sum: "$premiumAmount" }, 
                    policies: { $push: "$$ROOT" } 
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "_id",
                    foreignField: "_id",
                    as: "user" 
                }
            },
            {
                $unwind: "$user" 
            },
            {
                $project: {
                    _id: 0, 
                    userId: "$_id", 
                    userName: "$user.firstName", 
                    totalPremium: 1, 
                    policies: 1 
                }
            }
        ]);

        res.status(200).send({
            success: true,
            data: aggregatedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};
