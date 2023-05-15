const XLSX = require("xlsx");
const fs = require('fs');
const path = require('path');
const {convertCSVtoTXT} = require('./csv-parser')

const xlslDirectoryPath = './xlsldirectory';
const csvDirectoryPath = './csvdirectory';

fs.readdir(xlslDirectoryPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    transformToCSV(files.filter((file) => path.extname(file) === '.xlsx'))
});


const transformToCSV = (xlsxFiles) => {

    if (!fs.existsSync(csvDirectoryPath)) {
        fs.mkdirSync(csvDirectoryPath);
    }

    xlsxFiles.forEach((xlsxFile) => {
        const xlsxFilePath = path.join(xlslDirectoryPath, xlsxFile);

        const csvFilePath = path.join(csvDirectoryPath, `${path.basename(xlsxFile, '.xlsx')}.csv`);

        const readStream = fs.createReadStream(xlsxFilePath);
        const writeStream = fs.createWriteStream(csvFilePath);

        const buffers = [];

        readStream.on('data', (data) => buffers.push(data));

        readStream.on('end', () => {
            const buffer = Buffer.concat(buffers);

            const workbook = XLSX.read(buffer, {type: 'buffer'});
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const csvContent = convertJsonToCsv(jsonData);

            writeStream.write(csvContent, 'utf-8');
            writeStream.end();

            writeStream.on('finish', () => {
                console.log(`CSV file '${csvFilePath}' has been created successfully.`);
                convertCSVtoTXT(csvFilePath)
            });

            writeStream.on('error', (err) => {
                console.error(`Error creating CSV file from '${xlsxFile}':`, err);
            });
        });
    });
}

const convertJsonToCsv = (jsonData) => {
    const header = Object.keys(jsonData[0]).join(',');
    const rows = jsonData.map((row) => Object.values(row).join(','));

    return `${header}\n${rows.join('\n')}`;
}




