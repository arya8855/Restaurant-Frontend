import React from 'react';
import './Applogo.css';
import logoImage from '../assets/logo.png';
const Applogo = () => {
  return (
    <div className="logo-circle">
      <img src={logoImage} alt="App Logo" className="logo-img" />
    </div>
  );
};

export default Applogo;
