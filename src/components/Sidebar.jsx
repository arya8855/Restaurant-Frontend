import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartPie, FaClipboardList } from 'react-icons/fa';
import { MdBarChart } from "react-icons/md";
import { PiChairFill } from "react-icons/pi";
import Filter from './Filter';
import Applogo from './Applogo';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav className="nav-icons">
        <NavLink to="/" className={({ isActive }) => isActive ? 'icon active' : 'icon'}>
          <FaChartPie />
        </NavLink>
        <NavLink to="/tables" className={({ isActive }) => isActive ? 'icon active' : 'icon'}>
          <PiChairFill />
        </NavLink>
        <NavLink to="/ordertickets" className={({ isActive }) => isActive ? 'icon active' : 'icon'}>
          <FaClipboardList />
        </NavLink>
        <NavLink to="/menu" className={({ isActive }) => isActive ? 'icon active' : 'icon'}>
          <MdBarChart />
        </NavLink>
      </nav>

      <div className="bottom-circle"></div> {/* Bottom round circle */}
    </div>
  );
};

export default Sidebar;
