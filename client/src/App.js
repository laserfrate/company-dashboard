import React, { useState } from 'react';
import './App.css';
import CompanyForm from './components/CompanyForm';
import Report from './components/Report';
import Dashboard from './components/Dashboard';

function App() {
    const [results, setResults] = useState([]);
    const [counts, setCounts] = useState({
        veridion: 0,
        news: 0,
        googlePlaces: 0,
    });
    const [showVeridion, setShowVeridion] = useState(false);
    const [showNews, setShowNews] = useState(false);
    const [showGooglePlaces, setShowGooglePlaces] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const generateReport = async (companies) => {
        const response = await fetch('http://localhost:5000/enrich', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ companies }),
        });
        const data = await response.json();
        setResults(data);

        const newCounts = {
            veridion: 0,
            news: 0,
            googlePlaces: 0,
        };

        data.forEach(result => {
            if (result.veridionData && !result.veridionData.error) newCounts.veridion += result.veridionData.length;
            if (result.newsData && !result.newsData.error) newCounts.news += result.newsData.length;
            if (result.googlePlacesData && !result.googlePlacesData.error) newCounts.googlePlaces++;
        });

        setCounts(newCounts);
        setShowVeridion(false);
        setShowNews(false);
        setShowGooglePlaces(false);
        setShowDashboard(false);
    };

    const handleToggle = (toggleFunction) => {
        setShowVeridion(false);
        setShowNews(false);
        setShowGooglePlaces(false);
        setShowDashboard(false);
        toggleFunction(prevState => !prevState);
        setCurrentPage(1);
    };

    const handleGenerateDashboard = () => {
        setShowDashboard(prevState => !prevState);
    };

    return (
        <div className="App">
            <div className="header">Company Enrichment Dashboard</div>
            <div className="container">
                <CompanyForm onGenerateReport={generateReport} />
                <div className="result-container">
                    {results.length > 0 && (
                        <>
                            <div className="summary-buttons">
                                <button onClick={() => handleToggle(setShowVeridion)}>Toggle Veridion Data ({counts.veridion})</button>
                                <button onClick={() => handleToggle(setShowNews)}>Toggle News Data ({counts.news})</button>
                                <button onClick={() => handleToggle(setShowGooglePlaces)}>Toggle Google Places Data ({counts.googlePlaces})</button>
                            </div>
                            <button onClick={handleGenerateDashboard}>Generate Dashboard</button>
                        </>
                    )}
                    {!showDashboard && (
                        <Report
                            results={results}
                            showVeridion={showVeridion}
                            showNews={showNews}
                            showGooglePlaces={showGooglePlaces}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
                    {showDashboard && (
                        <Dashboard results={results} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
