import React, { useState } from 'react';
import SearchStok from '../components/SearchStok';
import StokList from '../components/StokList';

const StokPage = () => {
  const [filters, setFilters] = useState({});

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
  };

  return (
    <div>
      <SearchStok onSearch={handleSearch} />
      <StokList filters={filters} />
    </div>
  );
};

export default StokPage;
