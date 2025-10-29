import React, { createContext, useContext, useState } from 'react';

const filterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [activeFilter, setActiveFilter] = useState('');
  return (
    <filterContext.Provider value={{ activeFilter, setActiveFilter }}>
      {children}
    </filterContext.Provider>
  );
};

export const useFilter = () => useContext(filterContext);
