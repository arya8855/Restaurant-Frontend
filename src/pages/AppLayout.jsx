import React, {useState} from 'react';
import Sidebar from '../components/Sidebar';
import Filter from '../components/Filter';
import Applogo from '../components/Applogo';
import './AppLayout.css';
import { useFilter } from '../context/filterContext';

const AppLayout = ({ children }) => {
  const { setActiveFilter } = useFilter();

  return (
    <div className="app-layout">
      <div className="app-header">
        <Applogo />
        <Filter onFilterChange={setActiveFilter} />
      </div>   
      <div className="main-container">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;