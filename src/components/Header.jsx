import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`navbar navbar-expand-lg navbar-light header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">내 포트폴리오</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="네비게이션 토글">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" end to="/">홈</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">소개</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/projects">프로젝트</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">연락처</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;