import React from 'react';
import './Filter.css';

function Filter({ onFilterChange }) {
  const handleChange = (e) => {
    if (onFilterChange) {
      onFilterChange(e.target.value.toLowerCase());
    }
  };

  return (
    <div className="filterBar">
      <input
        type="text"
        placeholder="Filter..."
        onChange={handleChange}
      />
    </div>
  );
}

export default Filter;
