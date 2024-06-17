const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const getNewsData = async (company) => {
    try {
        const query = company.name.split(' ').join('+');
        const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}`);
        const articles = newsResponse.data.articles;
        return articles;
    } catch (error) {
        console.error('Error fetching news data for company:', company.name, error);
        return { error: 'Failed to fetch news data.' };
    }
};

const getVeridionData = async (company) => {
    const results = [];
    const tempFilePath = path.join(__dirname, 'veridion_dataset.csv');

    try {
        // Download the file from Google Drive
        const response = await axios({
            url: 'https://drive.google.com/uc?export=download&id=1KolHZSAqMwH1CKAL-va2I_nXEer5ADNv',
            method: 'GET',
            responseType: 'stream',
        });

        // Save the file locally
        const writer = fs.createWriteStream(tempFilePath);
        response.data.pipe(writer);

        // Wait for the file to be fully written
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Process the CSV file
        return new Promise((resolve, reject) => {
            fs.createReadStream(tempFilePath)
                .pipe(csv({ separator: ';' }))
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    let filteredData = results.filter(row =>
                        row.company_name && row.company_name.toLowerCase().includes(company.name.toLowerCase())
                    );

                    if (company.domain) {
                        filteredData = filteredData.filter(row =>
                            row.domain && row.domain.toLowerCase().includes(company.domain.toLowerCase())
                        );
                    }

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
    } finally {
        // Clean up the temporary file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
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
