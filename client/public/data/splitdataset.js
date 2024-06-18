const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Funcție pentru a împărți un array în n părți egale
const splitArrayIntoChunks = (array, chunkCount) => {
    const chunks = [];
    const chunkSize = Math.ceil(array.length / chunkCount);
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
};

// Funcție pentru a scrie un array de obiecte într-un fișier CSV
const writeCSV = (filename, headers, data) => {
    const csvContent = [headers.join(';'), ...data.map(row => headers.map(header => row[header]).join(';'))].join('\n');
    fs.writeFileSync(filename, csvContent);
};

// Funcția principală pentru a citi, împărți și verifica dataset-ul
const processVeridionDataset = () => {
    const filePath = path.join(__dirname, './veridion_dataset.csv');
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });

    const results = [];
    let headers = [];

    rl.on('line', (line) => {
        const columns = line.split(';');
        if (headers.length === 0) {
            headers = columns;
        } else {
            const record = {};
            columns.forEach((col, index) => {
                record[headers[index]] = col.trim();
            });
            results.push(record);
        }
    });

    rl.on('close', () => {
        const chunks = splitArrayIntoChunks(results, 4);

        // Salvare în fișiere CSV
        chunks.forEach((chunk, index) => {
            writeCSV(`veridion_dataset_part${index + 1}.csv`, headers, chunk);
        });

        // Verificare companii specifice
        const companiesToCheck = [
            { company_name: 'Flying M2 Designs', domain: 'flyingm2designs.com' },
            { company_name: 'Magnetic Island Concrete', domain: 'magneticislandconcrete.com.au' },
            { company_name: 'Tom\'s Pallets', domain: 'tomspallets.com' },
            { company_name: 'LDM Leisure', domain: 'ldmleisure.co.uk' },
            { company_name: 'Phoenix Precast Products', domain: 'phoenixprecastproducts.com' },
            { company_name: 'DiCianni Graphics', domain: 'diciannigraphics.com' }
        ];

        companiesToCheck.forEach(company => {
            let found = false;
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                const foundCompany = chunk.find(record => record.company_name === company.company_name && record.domain === company.domain);
                if (foundCompany) {
                    console.log(`Company ${company.company_name} with domain ${company.domain} is found in part ${i + 1}`);
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log(`Company ${company.company_name} with domain ${company.domain} is not found in any part`);
            }
        });
    });

    rl.on('error', (error) => {
        console.error('Error reading Veridion dataset:', error);
    });
};

processVeridionDataset();
