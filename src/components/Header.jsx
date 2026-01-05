import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../assets/images/site_logo.png';

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowWidth;
};

const Header = ({ activeParentSectionId, user, onGoogleLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || isSearchOpen) ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen, isSearchOpen]);

  const handleSearchIconClick = () => setIsSearchOpen(true);

  const menuItems = [
    { name: 'HOME', anchor: '#home' },
    { name: '회사소개', anchor: '#about-vision' },
    { name: '사업분야', anchor: '#business-scope' },
    { name: '제품', anchor: '#products-product1' },
    { name: '적용사례', anchor: '#cases-example1' },
    { name: '고객센터', anchor: '#support' },
  ];

  const getParentIdFromAnchor = (anchor) => {
    const id = anchor.substring(1); // # 제거
    if (id.startsWith('about-')) return 'about';
    if (id.startsWith('business-')) return 'business';
    if (id.startsWith('products-')) return 'products';
    if (id.startsWith('cases-')) return 'cases';
    if (id.startsWith('support')) return 'support';
    return id; // home
  };

  const activeItemName = menuItems.find(item => getParentIdFromAnchor(item.anchor) === activeParentSectionId)?.name;

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-container">
          <a href="#home" className="logo" onClick={() => setIsMenuOpen(false)}>
            <img src={logo} alt="Daonrs Logo" style={{height: '28px'}}/>
          </a>
        </div>
        
        <button className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>

        {/* 데스크톱 nav는 그대로 유지 */}
        <div className={`mobile-menu-wrapper ${isMenuOpen ? 'open' : ''}`}>
          <nav className="nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <a href={item.anchor} onClick={() => setIsMenuOpen(false)} className={getParentIdFromAnchor(item.anchor) === activeParentSectionId ? 'active' : ''}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-utils">
            {windowWidth > 768 ? (
              <button onClick={handleSearchIconClick} className="search-icon-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            ) : (
              <div className="search-container">
                <input type="text" placeholder="검색" />
                <button>검색</button>
              </div>
            )}

            <div className="auth-container">
              {user ? (
                <div className="user-profile">
                  <img src={user.user_metadata.avatar_url} alt="profile" className="avatar" />
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="auth-btn logout">로그아웃</button>
                </div>
              ) : (
                <button onClick={() => { onGoogleLogin(); setIsMenuOpen(false); }} className="auth-btn google">
                  <img src="https://developers.google.com/static/identity/images/g-logo.png" alt="G" />
                  <span>로그인</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {isSearchOpen && windowWidth > 768 && (
          <div className="search-overlay">
            <div className="search-overlay-content">
              <input type="text" placeholder="검색어를 입력하세요..." autoFocus />
              <button className="search-submit-btn">검색</button>
              <button onClick={() => setIsSearchOpen(false)} className="search-close-btn">&times;</button>
            </div>
          </div>
        )}
        
        {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>}
      </div>

      {/* [수정] 모바일 전용 액티브 섹션 표시줄 (2단 분리) */}
      {activeItemName && windowWidth <= 768 && (
        <div className="mobile-active-bar">
          <span>{activeItemName}</span>
        </div>
      )}
    </header>
  );
};

export default Header;