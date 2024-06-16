const fs = require('fs');
const path = require('path');
const readline = require('readline');

const checkVeridionDataset = () => {
    const filePath = path.join(__dirname, '../data/veridion_dataset.csv');
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });

    const results = [];
    let headers = [];
    let currentRecord = {};

    rl.on('line', (line) => {
        const columns = line.split(';');
        if (headers.length === 0) {
            headers = columns;
        } else {
            if (columns.length === headers.length) {
                if (Object.keys(currentRecord).length > 0) {
                    results.push(currentRecord);
                }
                currentRecord = {};
                columns.forEach((col, index) => {
                    currentRecord[headers[index]] = col.trim();
                });
            } else {
                // Handle multi-line values here
                headers.forEach((header, index) => {
                    if (columns[index]) {
                        currentRecord[header] = (currentRecord[header] || '') + ' ' + columns[index].trim();
                    }
                });
            }
        }
    });

    rl.on('close', () => {
        if (Object.keys(currentRecord).length > 0) {
            results.push(currentRecord);
        }
        console.log('First 10 records from Veridion dataset:', results.slice(0, 50));
    });

    rl.on('error', (error) => {
        console.error('Error reading Veridion dataset:', error);
    });
};

checkVeridionDataset();
