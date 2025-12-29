import React, { useState, useEffect } from 'react';
import logo from '../assets/images/site_logo.png';

const Header = ({ activeSectionId, user, onGoogleLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Stop body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);


  const menuItems = [
    { name: '홈', anchor: '#home' },
    { name: '회사소개', anchor: '#about' },
    { name: '사업분야', anchor: '#business' },
    { name: '제품', anchor: '#products' },
    { name: '적용사례', anchor: '#cases' },
    { name: '고객센터', anchor: '#support' },
  ];

  const getCleanActiveId = (id) => {
    if (!id) return null;
    return id.includes('-') ? `#${id.split('-')[0]}` : `#${id}`;
  };

  const currentMainSectionId = getCleanActiveId(activeSectionId);

  const activeItemName = menuItems.find(item => item.anchor === currentMainSectionId)?.name;


  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        {/* 좌측 로고 */}
        <a href="#home" className="logo" onClick={() => setIsMenuOpen(false)}>
          <img src={logo} alt="Daonrs Logo" style={{height: '30px'}}/>
        </a>
        
        {/* 모바일 햄버거 메뉴 버튼 */}
        <button className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>

        {/* 모바일에서 현재 활성화된 탭 이름 표시 */}
        {activeItemName && (
          <div className="mobile-active-section-name">
            {activeItemName}
          </div>
        )}

        <div className={`mobile-menu-wrapper ${isMenuOpen ? 'open' : ''}`}>
          <nav className="nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <a href={item.anchor} onClick={() => setIsMenuOpen(false)} className={currentMainSectionId === item.anchor ? 'active' : ''}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-utils">
            <div className="search-container">
              <input type="text" placeholder="검색" />
              <button>검색</button>
            </div>

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
        
        {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>}

      </div>
    </header>
  );
};

export default Header;