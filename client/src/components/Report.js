import React from 'react';
import { Helmet } from 'react-helmet';
import './Report.css';

const Report = ({
    results,
    showVeridion,
    showNews,
    showGooglePlaces,
    currentPage,
    setCurrentPage,
    itemsPerPage
}) => {
    const isEmptyData = (data) => {
        return !data || Object.keys(data).length === 0 || (data.error && data.error.length > 0);
    };

    const paginate = (array, pageNumber) => {
        return array.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);
    };

    return (
        <div className="report-container">
            {paginate(results, currentPage).map((result, index) => (
                <div key={index} className="result-card">
                    <Helmet>
                        <title>{result.name} - Company Report</title>
                        <meta name="description" content={`Detailed report for ${result.name}`} />
                        <meta name="keywords" content={`company report, ${result.name}, business data`} />
                        <meta property="og:title" content={`${result.name} - Company Report`} />
                        <meta property="og:description" content={`Detailed report for ${result.name}`} />
                        <meta property="og:url" content={window.location.href} />
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content={`${result.name} - Company Report`} />
                        <meta name="twitter:description" content={`Detailed report for ${result.name}`} />
                    </Helmet>
                    <h3 className="company-name">{result.name}</h3>
                    <div className="company-info">
                        <strong>Address:</strong> {result.address} <br />
                        <strong>Domain:</strong> {result.domain}
                    </div>
                    {showVeridion && (
                        <div className="section">
                            <h3>Veridion Data:</h3>
                            {isEmptyData(result.veridionData) ? (
                                <p>No relevant information from Veridion.</p>
                            ) : (
                                <div className="formatted-data">
                                    {result.veridionData.map((data, idx) => (
                                        <div key={idx} className="veridion-record">
                                            {Object.keys(data).map((key) => (
                                                <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {data[key]}</p>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {showNews && (
                        <div className="section">
                            <h3>News Data:</h3>
                            {isEmptyData(result.newsData) ? (
                                <p>No relevant news articles found.</p>
                            ) : (
                                result.newsData.map((news, idx) => (
                                    <div key={idx} className="news-article">
                                        <h4>{news.title}</h4>
                                        <p><strong>Source:</strong> {news.source.name}</p>
                                        <p><strong>Author:</strong> {news.author}</p>
                                        <p>{news.description}</p>
                                        <a href={news.url} target="_blank" rel="noopener noreferrer">Read more</a>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {showGooglePlaces && (
                                    <div className="section">
                                        <h3>Google Places Data:</h3>
                                        {isEmptyData(result.googlePlacesData) ? (
                                            <p>No relevant information from Google Places.</p>
                                        ) : (
                                            <div className="formatted-data">
                                                {result.googlePlacesData.address_components && result.googlePlacesData.address_components.length > 0 && (
                                                    <div>
                                                        <h4>Address Components:</h4>
                                                        {result.googlePlacesData.address_components.map((component, idx) => (
                                                            <p key={idx}><strong>{component.types.join(', ')}:</strong> {component.long_name}</p>
                                                        ))}
                                                    </div>
                                                )}
                                                {result.googlePlacesData.formatted_address && (
                                                    <p><strong>Formatted Address:</strong> {result.googlePlacesData.formatted_address}</p>
                                                )}
                                                {result.googlePlacesData.phone_number && (
                                                    <p><strong>Phone Number:</strong> {result.googlePlacesData.phone_number}</p>
                                                )}
                                                {result.googlePlacesData.international_phone_number && (
                                                    <p><strong>International Phone Number:</strong> {result.googlePlacesData.international_phone_number}</p>
                                                )}
                                                {result.googlePlacesData.geometry && result.googlePlacesData.geometry.location && (
                                                    <div>
                                                        <h4>Geometry:</h4>
                                                        <p><strong>Latitude:</strong> {result.googlePlacesData.geometry.location.lat}</p>
                                                        <p><strong>Longitude:</strong> {result.googlePlacesData.geometry.location.lng}</p>
                                                    </div>
                                                )}
                                                {result.googlePlacesData.opening_hours && result.googlePlacesData.opening_hours.weekday_text && result.googlePlacesData.opening_hours.weekday_text.length > 0 && (
                                                    <div>
                                                        <h4>Opening Hours:</h4>
                                                        {result.googlePlacesData.opening_hours.weekday_text.map((hours, idx) => (
                                                            <p key={idx}>{hours}</p>
                                                        ))}
                                                    </div>
                                                )}
                                                {result.googlePlacesData.photos && result.googlePlacesData.photos.length > 0 && (
                                                    <div>
                                                        <h4>Photos:</h4>
                                                        {result.googlePlacesData.photos.map((photo, idx) => (
                                                            <img key={idx} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`} alt="Place" />
                                                        ))}
                                                    </div>
                                                )}
                                                {result.googlePlacesData.place_id && (
                                                    <p><strong>Place ID:</strong> {result.googlePlacesData.place_id}</p>
                                                )}
                                                {result.googlePlacesData.plus_code && (
                                                    <p><strong>Plus Code:</strong> {result.googlePlacesData.plus_code.global_code}</p>
                                                )}
                                                {result.googlePlacesData.rating && (
                                                    <p><strong>Rating:</strong> {result.googlePlacesData.rating}</p>
                                                )}
                                                {result.googlePlacesData.reviews && result.googlePlacesData.reviews.length > 0 && (
                                                    <div>
                                                        <h4>Reviews:</h4>
                                                        {result.googlePlacesData.reviews.map((review, idx) => (
                                                            <div key={idx}>
                                                                <p><strong>{review.author_name}:</strong> {review.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {result.googlePlacesData.types && (
                                                    <p><strong>Types:</strong> {result.googlePlacesData.types.join(', ')}</p>
                                                )}
                                                {result.googlePlacesData.url && (
                                                    <p><strong>URL:</strong> <a href={result.googlePlacesData.url} target="_blank" rel="noopener noreferrer">{result.googlePlacesData.url}</a></p>
                                                )}
                                                {result.googlePlacesData.vicinity && (
                                                    <p><strong>Vicinity:</strong> {result.googlePlacesData.vicinity}</p>
                                                )}
                                                {result.googlePlacesData.website && (
                                                    <p><strong>Website:</strong> <a href={result.googlePlacesData.website} target="_blank" rel="noopener noreferrer">{result.googlePlacesData.website}</a></p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                    )}
                </div>
            ))}
        </div>
    );
};

export default Report;
