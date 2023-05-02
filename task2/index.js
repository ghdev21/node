const {exec} = require('child_process');
const fs = require('fs');
const os = require('os');
const {sleep, throttle} = require('./utils');

const LOG_FILE = 'activityMonitor.log';
const formatUnixOSData = (process) => {
    const mostCPUIntensive = process.trim().split('\n')[1];
    const [cpu, memory, ...command] = mostCPUIntensive.trim().split(/\s+/g);
    const name = command.join(' ');
    return {name, cpu, memory};
};

const formatWin32Data = (process) => {
    const [cpu, memory, ...command] = process.trim().split(/\s+/g).reverse(); // chrome, cpu, mem revert to extract cpu, mem
    const name = command.reverse().join(' '); //revert and join name back
    return {name, cpu, memory};
};

const commandMappings = {
    win32: {
        command: `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`,
        formatData: formatWin32Data,
    },
    darwin: {
        command: 'ps -A -o %cpu,%mem,comm -r',
        formatData: formatUnixOSData,
    },
    linux: {
        command: 'ps -eo %cpu,%mem,comm --sort=-%cpu',
        formatData: formatUnixOSData
    },
}
const getTopProcess = (command, formatData) => new Promise((resolve, reject) => {
    return exec(command, (error, stdout, stderr) => {
        if (error) {
            reject(error);
            return;
        }

        resolve(formatData(stdout));
    });
})

const trackActivity = (data) => {
    fs.appendFile(LOG_FILE, `${data}\n`, (err) => {
        if (err) throw err;
    });
}

(async () => {
    const updateFile = throttle(trackActivity, 60000); //one minute

    while (true) {
        try {
            const {command, formatData} = commandMappings[os.platform()];
            const {cpu, memory, name} = await getTopProcess(command, formatData);
            const output = `${Date.now()}: CPU ${cpu}% | MEM ${memory}% | ${name}`;

            process.stdout.write(`\r${output}`);
            process.stdout.write('\r');
            updateFile(output)

            await sleep(100);
        } catch (err) {
            console.error(err);
        }
    }
})();
