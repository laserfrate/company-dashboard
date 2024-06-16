const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const {
    getNewsData,
    getVeridionData,
    getGooglePlacesData
} = require('./utils/dataFetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.post('/enrich', async (req, res) => {
    const companies = req.body.companies;

    if (!Array.isArray(companies) || companies.length === 0) {
        return res.status(400).json({ error: 'Invalid input. Please provide a list of companies.' });
    }

    const enrichedData = [];

    for (const company of companies) {
        const { name, domain, address, main_country, main_region, main_city, main_postcode } = company;

        if (!name) {
            return res.status(400).json({ error: 'Each company must have at least a name.' });
        }

        try {
            const veridionData = await getVeridionData(company);
            const newsData = await getNewsData(company);
            const googlePlacesData = await getGooglePlacesData({ name, address, city: main_city, region: main_region, country: main_country });

            const combinedData = {
                ...company,
                veridionData,
                newsData,
                googlePlacesData
            };

            enrichedData.push(combinedData);
        } catch (error) {
            console.error(`Error processing company data for ${company.name}:`, error);
            enrichedData.push({
                ...company,
                error: `Error processing company data for ${company.name}.`
            });
        }
    }

    res.json(enrichedData);
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
