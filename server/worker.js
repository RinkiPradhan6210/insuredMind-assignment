const { parentPort, workerData } = require("worker_threads");
const mongoose = require("mongoose");
const fs = require("fs");
const { parse } = require("csv-parse"); 
const xlsx = require("xlsx");
const Agent = require("./models/agent");
const User = require("./models/user");
const UserAccount = require("./models/userAccount");
const LOB = require("./models/lob");
const Carrier = require("./models/carrier");
const Policy = require("./models/policy");
const { connect } = require("./config/database"); 

const filePath = workerData.filePath;
const fileName = workerData.fileName;

// Function to process CSV files
async function processCSV(records) {
    const parser = fs.createReadStream(filePath).pipe(parse({ columns: true }));

    for await (const record of parser) {
        records.push(record);
    }
}

// Function to process XLSX files
async function processXLSX(records) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    records.push(...sheetData);
}

// Function to save records to the database
async function saveToDatabase(records) {
    for (const record of records) {
     
        const user = new User({
            firstName: record.firstname,
            dob: new Date(record.dob),
            address: record.address,
            phone: record.phone,
            state: record.state,
            zipCode: record.zip,
            email: record.email,
            gender: record.gender,
            userType: record.userType,
        });
         await user.save();

        const agent = new Agent({
            agentName: record.agent,
        });
        await agent.save();

        const userAccount = new UserAccount({
            accountName: record.account_name,
        });
        await userAccount.save();

        const lob = new LOB({
            categoryName: record.category_name,
        });
        await lob.save();

        const carrier = new Carrier({
            companyName: record.company_name,
        });
        await carrier.save();

        // Creating and saving the Policy 
        const policy = new Policy({
            policyNumber: record.policy_number,
            policyStartDate: new Date(record.policy_start_date),
            policyEndDate: new Date(record.policy_end_date),
            premiumAmountWritten: record.premium_amount_written ? parseFloat(record.premium_amount_written):0,
            premiumAmount: parseFloat(record.premium_amount),
            policyType: record.policy_type,
            agent: agent._id,
            user: user._id,
            userAccount: userAccount._id,
            lob: lob._id,
            carrier: carrier._id,
        });
       const policyData = await policy.save();
    }
}

// Start function to determine the file type and process it accordingly
async function start() {
    try {
        await connect(); 
        const records = [];
        if (fileName.endsWith(".csv")) {
            await processCSV(records);
        } else if (fileName.endsWith(".xlsx")) {s
            await processXLSX(records);
        }

        await saveToDatabase(records);
        parentPort.postMessage({ message: "Data uploaded successfully" });
    } catch (error) {
        parentPort.postMessage({ error: error.message });
        console.log(error);
    }
}

// Start processing the file
start();
