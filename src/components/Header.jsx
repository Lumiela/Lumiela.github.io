import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { menuItems } from '../content/menuData';
import './Header/Header.css'; 

import logo from '../assets/images/site_logo.png';
import daoniLogo from '../assets/images/daoni.png';

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowWidth;
};

const Header = ({ isAdmin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreenNavOpen, setIsFullscreenNavOpen] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 1024;

  const controlNavbar = () => {
    const currentScrollY = window.scrollY;
    
    // 최상단 여부 판단 (10px 이상 스크롤 시 배경 생성)
    setIsScrolled(currentScrollY > 10);

    // 스크롤 방향에 따른 헤더 노출/숨김 (기존 로직 유지)
    if (currentScrollY > 200 && currentScrollY > lastScrollY) {
      setVisible(false); // 아래로 스크롤 시 숨김
    } else {
      setVisible(true);  // 위로 스크롤 시 나타남
    }
    
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // 화면 크기 변경 시 모든 메뉴 닫기 (기존 유지)
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsFullscreenNavOpen(false);
    setOpenMobileSubMenu(null);
  }, [windowWidth]);

  const toggleMenu = () => {
    if (isDesktop) setIsFullscreenNavOpen(!isFullscreenNavOpen);
    else setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsFullscreenNavOpen(false);
    setOpenMobileSubMenu(null);
    setActiveMenu(null);
  };

  const handleMobileMainClick = (menuName) => {
    setOpenMobileSubMenu(openMobileSubMenu === menuName ? null : menuName);
  };

  // 모바일 메뉴 리스트 (기존 유지)
  const mobileNavLinks = (
    <ul>
      {menuItems.map((item) => (
        <li key={item.name}>
          <div className="main-menu-group">
            <div className="main-menu-item">
              {item.subMenus ? (
                <button className="menu-title-btn" onClick={() => handleMobileMainClick(item.name)}>
                  {item.name}
                </button>
              ) : (
                <NavLink to={item.path} onClick={closeAllMenus}>{item.name}</NavLink>
              )}
            </div>
            {item.subMenus && (
              <ul className={`submenu ${openMobileSubMenu === item.name ? 'show' : ''}`}>
                {item.subMenus.map(subItem => (
                  <li key={subItem.name}>
                    <NavLink to={`${item.path}/${subItem.path}`} onClick={closeAllMenus}>{subItem.name}</NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  // 데스크탑 메뉴 리스트 (기존 유지)
  const desktopNavLinks = (
    <ul>
      {menuItems.map((item) => (
        <li key={item.name}>
          <div className="main-menu-group">
            <div className="main-menu-item">
              {item.subMenus ? <span>{item.name}</span> : <NavLink to={item.path} onClick={closeAllMenus}>{item.name}</NavLink>}
            </div>
            {item.subMenus && (
              <ul className="submenu">
                {item.subMenus.map(subItem => (
                  <li key={subItem.name}>
                    <NavLink to={`${item.path}/${subItem.path}`} onClick={closeAllMenus}>{subItem.name}</NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <header 
        className={`header-container ${visible ? 'is-visible' : ''} ${isAdmin ? 'is-admin' : ''} ${isScrolled ? 'is-scrolled' : ''}`}
      >
        <div className="header-inner">
          <div className={`logo-container ${isScrolled ? 'is-scrolled' : ''}`}>
            <Link to="/" onClick={closeAllMenus}><img src={logo} alt="Logo" /></Link>
          </div>
          
          <nav className={`desktop-nav-container ${isScrolled ? 'is-scrolled' : ''}`}>
            <ul className="main-menu-list">
              {menuItems.map((item) => (
                <li key={item.name} className="main-menu-item" onMouseEnter={() => setActiveMenu(item.name)} onMouseLeave={() => setActiveMenu(null)}>
                  {item.subMenus ? (
                    <span className={activeMenu === item.name ? 'active' : ''}>{item.name}</span>
                  ) : (
                    <NavLink to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>
                      {item.name}
                    </NavLink>
                  )}
                  {activeMenu === item.name && item.subMenus && (
                    <div className={`dropdown-menu ${isScrolled ? 'is-scrolled' : ''}`}>
                      <ul>
                        {item.subMenus.map(subItem => (
                          <li key={subItem.name}>
                            <NavLink to={`${item.path}/${subItem.path}`} onClick={closeAllMenus}>{subItem.name}</NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {isDesktop && (
            <Link to="http://www.daonrs.com" target="_blank" onClick={closeAllMenus}>
              <img src={daoniLogo} alt="Daoni Logo" style={{ height: '60px', marginRight: '20px' }} />
            </Link>
          )}

          <button onClick={toggleMenu} className={`hamburger-menu ${isScrolled ? 'is-scrolled' : ''}`}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
        </div>
      </header>

      {/* 기존 메뉴 UI 유지 */}
      <div className={`fullscreen-nav-wrapper ${isFullscreenNavOpen ? 'is-open' : ''}`}>
        <div className="fullscreen-header">
           <div className="logo-container"><Link to="/" onClick={closeAllMenus}><img src={logo} alt="Logo" /></Link></div>
           <button onClick={closeAllMenus} className="close-button"><span></span><span></span></button>
        </div>
        <div className="fullscreen-content"><nav className="nav-list is-desktop">{desktopNavLinks}</nav></div>
      </div>

      <div className={`side-panel-wrapper ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <div className="panel-header">
          <div className="logo-container"><Link to="/" onClick={closeAllMenus}><img src={logo} alt="Logo" /></Link></div>
          <button onClick={closeAllMenus} className="close-button"><span></span><span></span></button>
        </div>
        <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 80px)' }}>
          <div style={{ flex: 1 }}><nav className="nav-list">{mobileNavLinks}</nav></div>
          <div style={{ padding: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
            <Link to="http://www.daonrs.com" target="_blank" onClick={closeAllMenus}>
              <img src={daoniLogo} alt="Daoni Logo" style={{ height: '70px' }} />
            </Link>
          </div>
        </div>
      </div>

      {(isMobileMenuOpen || isFullscreenNavOpen) && <div className="overlay" onClick={closeAllMenus} />}
    </>
  );
};

export default Header;