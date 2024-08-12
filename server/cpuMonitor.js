const os = require('os');
const { exec } = require('child_process');
const osUtils = require('node-os-utils');

const cpu = osUtils.cpu;

exports.checkCpuUsage = function() {
    console.log("calling the cpu users function");
    cpu.usage().then((info) => {
        console.log(`Current CPU Usage: ${info}%`);
        if (info > 70) {
            console.log('CPU usage exceeded 70%, restarting server...');
            exec('pm2 restart insured-mine', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error restarting server: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        }
    }).catch(err => console.error(err));
}
