import React from 'react';
import './DaoniFloatingButton.css';
import daoniLogo from '../assets/images/daoni.png';

const DaoniFloatingButton = () => {
  return (
    <a 
      href="http://www.daonrs.com/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="floating-daoni-button"
      aria-label="Daoni 홈페이지로 이동"
    >
      <img src={daoniLogo} alt="Daoni" />
    </a>
  );
};

export default DaoniFloatingButton;
