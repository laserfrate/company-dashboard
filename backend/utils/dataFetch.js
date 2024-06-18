const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const getNewsData = async (company) => {
    try {
        const query = `${company.name} ${company.domain ? company.domain : ''} ${company.main_country ? company.main_country : ''}`;
        const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`);
        const articles = newsResponse.data.articles;

        // Filtrare articole relevante
        const relevantArticles = articles.filter(article => 
            article.title.toLowerCase().includes(company.name.toLowerCase()) || 
            article.description.toLowerCase().includes(company.name.toLowerCase())
        );

        return relevantArticles;
    } catch (error) {
        console.error('Error fetching news data for company:', company.name, error);
        return { error: 'Failed to fetch news data.' };
    }
};

const getVeridionData = async (company) => {
    try {
        const results = [];
        const filePath = path.resolve(__dirname, '../../client/public/data/veridion_datasets.csv');
        console.log('Processing Veridion dataset from local file...');
        console.log('Reading Veridion dataset from:', filePath);

        if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            return { error: 'File not found.' };
        }

        // Verifică dacă fișierul există și are drepturi de acces
        try {
            await fs.promises.access(filePath, fs.constants.R_OK);
        } catch (err) {
            console.error('File not accessible:', filePath, err);
            return { error: 'File not accessible.' };
        }

        // Read the CSV file locally
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv({ separator: ';' }))
                .on('data', (data) => {
                    console.log('Row data:', data);
                    results.push(data);
                })
                .on('end', () => {
                    console.log('Total rows fetched:', results.length);
                    let filteredData = results.filter(row =>
                        row.company_name && row.company_name.toLowerCase().includes(company.name.toLowerCase())
                    );

                    if (company.domain) {
                        filteredData = filteredData.filter(row =>
                            row.domain && row.domain.toLowerCase().includes(company.domain.toLowerCase())
                        );
                    }

                    console.log('Filtered data:', filteredData);
                    resolve(filteredData.length > 0 ? filteredData : { error: 'No data found in Veridion dataset.' });
                })
                .on('error', (error) => {
                    console.error('Error reading Veridion dataset:', error);
                    reject({ error: 'Failed to read Veridion dataset.' });
                });
        });
    } catch (error) {
        console.error('Error fetching or processing Veridion dataset:', error);
        return { error: 'Failed to fetch or process Veridion dataset.' };
    }
};

const getGooglePlacesData = async (company) => {
    try {
        const query = company.name + (company.domain ? ` ${company.domain}` : '');
        const googlePlacesResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_PLACES_API_KEY}`);
        
        if (googlePlacesResponse.data.results.length === 0) {
            return { error: 'No data found on Google Places.' };
        }

        // Iterate through results to find the best match
        const place = googlePlacesResponse.data.results.find(result => 
            result.name.toLowerCase().includes(company.name.toLowerCase()) || 
            (company.domain && result.formatted_address && result.formatted_address.toLowerCase().includes(company.domain.toLowerCase()))
        );

        if (!place) {
            return { error: 'No matching place found.' };
        }

        const placeId = place.place_id;
        const fields = 'address_components,formatted_address,formatted_phone_number,international_phone_number,geometry,opening_hours,photos,place_id,plus_code,rating,reviews,types,url,vicinity,website';
        const placeDetailsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${process.env.GOOGLE_PLACES_API_KEY}`);

        const details = placeDetailsResponse.data.result;

        return {
            address_components: details.address_components || [],
            formatted_address: details.formatted_address || '',
            phone_number: details.formatted_phone_number || '',
            international_phone_number: details.international_phone_number || '',
            geometry: details.geometry || {},
            opening_hours: details.opening_hours || {},
            photos: details.photos || [],
            place_id: details.place_id || '',
            plus_code: details.plus_code || {},
            rating: details.rating || 0,
            reviews: details.reviews || [],
            types: details.types || [],
            url: details.url || '',
            vicinity: details.vicinity || '',
            website: details.website || ''
        };
    } catch (error) {
        console.error('Error fetching data from Google Places API:', error.response ? error.response.data : error.message);
        return { error: 'Failed to fetch Google Places data.' };
    }
};

module.exports = { 
    getNewsData, 
    getVeridionData, 
    getGooglePlacesData 
};
