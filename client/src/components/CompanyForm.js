import React, { useState } from 'react';

const CompanyForm = ({ onGenerateReport }) => {
    const [companies, setCompanies] = useState([{ name: '', address: '', domain: '' }]);

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        setCompanies(companies.map((company, i) => (
            i === index ? { ...company, [name]: value } : company
        )));
    };

    const handleAddCompany = () => {
        setCompanies([...companies, { name: '', address: '', domain: '' }]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onGenerateReport(companies);
    };

    return (
        <form onSubmit={handleSubmit}>
            {companies.map((company, index) => (
                <div key={index} className="company-inputs">
                    <input
                        type="text"
                        name="name"
                        placeholder="Company Name"
                        value={company.name}
                        onChange={(e) => handleChange(index, e)}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Company Address"
                        value={company.address}
                        onChange={(e) => handleChange(index, e)}
                    />
                    <input
                        type="text"
                        name="domain"
                        placeholder="Company Domain"
                        value={company.domain}
                        onChange={(e) => handleChange(index, e)}
                    />
                </div>
            ))}
            <div className="form-actions">
                <button type="button" onClick={handleAddCompany}>Add Another Company</button>
                <button type="submit">Generate Report</button>
            </div>
        </form>
    );
};

export default CompanyForm;
