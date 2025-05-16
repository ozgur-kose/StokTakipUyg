import React, { useState } from 'react';
import './SearchStok.css'; 

const SearchStok = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    urunKodu: '',
    ureticiKodu: '',
    urunAdi: '',
    marka: '',
    urunTip: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log("Filtreler gönderildi:", filters);
    onSearch(filters);
  };

  return (
    <div className="search-stok-container">
      <h2>Stok Arama</h2>
      <div className="form-row">
        {['urunKodu', 'ureticiKodu', 'urunAdi', 'marka', 'urunTip'].map((field, index) => (
          <div className="form-group" key={index}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              name={field}
              type="text"
              placeholder={field}
              value={filters[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="form-button">
          <button onClick={handleSearch}>Arama</button>
        </div>
      </div>
    </div>
  );
};

export default SearchStok;
