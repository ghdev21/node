const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const convertCSVtoTXT = (csvFilePath) => {
    const outputFolderPath = '../dist'
    const readStream = fs.createReadStream(csvFilePath, 'utf-8');

    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath);
    }

    const fileName = path.basename(csvFilePath, '.csv');

    const writeStream = fs.createWriteStream(path.join(outputFolderPath, `${fileName}.txt`), 'utf-8');

    readStream
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
        })
        .pipe(csv())
        .on('error', (err) => {
            console.error('Error parsing CSV:', err);
        })
        .on('data', (buffer) => {
            const {data} = buffer.toJSON();
            const buf = Buffer.from(data).toString();
            console.log(buf)
            writeStream.write(`${buf.toString()}\n`, (err) => {
                if (err) {
                    console.error('Error writing to TXT file:', err);
                }
            });
        })
        .on('end', () => {
            writeStream.end();

            console.log('Conversion completed successfully.');
        });
}

module.exports = {
    convertCSVtoTXT
}
