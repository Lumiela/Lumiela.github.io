import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { menuItems } from '../content/menuData';
import {
  HeaderContainer,
  HeaderInner,
  LogoContainer,
  DesktopNavContainer,
  HamburgerMenu,
  SidePanelWrapper,
  DropdownMenu,
  FullscreenNavWrapper,
  NavList,
  Overlay,
  CloseButton
} from './Header/styles.js';
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
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 1024;

  const controlNavbar = () => {
    if (window.scrollY > 200 && window.scrollY > lastScrollY) setVisible(false);
    else setVisible(true);
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

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
                    <NavLink to={`${item.path}/${subItem.path}`} onClick={closeAllMenus}>
                      {subItem.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

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
      <HeaderContainer $isAdmin={isAdmin} $visible={visible}>
        <HeaderInner>
          <LogoContainer>
            <Link to="http://www.daonrs.com/login" target="_blank" rel="noopener noreferrer" onClick={closeAllMenus}>
              <img src={logo} alt="Logo" />
            </Link>
          </LogoContainer>
          
          <DesktopNavContainer>
            <ul className="main-menu-list">
              {menuItems.map((item) => (
                <li key={item.name} className="main-menu-item" onMouseEnter={() => setActiveMenu(item.name)} onMouseLeave={() => setActiveMenu(null)}>
                  {item.subMenus ? <span className={activeMenu === item.name ? 'active' : ''}>{item.name}</span> : <NavLink to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>{item.name}</NavLink>}
                  {activeMenu === item.name && item.subMenus && (
                    <DropdownMenu>
                      <ul>
                        {item.subMenus.map(subItem => (
                          <li key={subItem.name}><NavLink to={`${item.path}/${subItem.path}`} onClick={closeAllMenus}>{subItem.name}</NavLink></li>
                        ))}
                      </ul>
                    </DropdownMenu>
                  )}
                </li>
              ))}
            </ul>
          </DesktopNavContainer>

          {/* 데스크탑에서만 보이는 daoni 로고 */}
          {isDesktop && (
            <Link to="https://daonrs.com" target="_blank" rel="noopener noreferrer" onClick={closeAllMenus}>
              <img src={daoniLogo} alt="Daoni Logo" style={{ height: '40px', marginRight: '20px' }} />
            </Link>
          )}

          <HamburgerMenu onClick={toggleMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </HamburgerMenu>
        </HeaderInner>
      </HeaderContainer>

      {/* 데스크톱 전용 풀스크린 (여기에도 하단에 넣고 싶다면 동일하게 적용 가능) */}
      <FullscreenNavWrapper $isOpen={isFullscreenNavOpen}>
        <div className="fullscreen-header">
           <LogoContainer><Link to="https://daonrs.com" target="_blank" rel="noopener noreferrer" onClick={closeAllMenus}><img src={logo} alt="Logo" /></Link></LogoContainer>
           <CloseButton onClick={closeAllMenus}><span></span><span></span></CloseButton>
        </div>
        <div className="fullscreen-content"><NavList $isDesktop={true}>{desktopNavLinks}</NavList></div>
      </FullscreenNavWrapper>

      {/* 모바일 전용 사이드 패널 (우측에서 등장) */}
      <SidePanelWrapper $isOpen={isMobileMenuOpen}>
        <div className="panel-header">
          <LogoContainer><Link to="https://daonrs.com" target="_blank" rel="noopener noreferrer" onClick={closeAllMenus}><img src={logo} alt="Logo" /></Link></LogoContainer>
          <CloseButton onClick={closeAllMenus}><span></span><span></span></CloseButton>
        </div>
        
        {/* 수정 포인트: 패널 내부 하단에 로고 배치 */}
        <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 80px)' }}>
          <div style={{ flex: 1 }}>
            <NavList $isDesktop={false}>{mobileNavLinks}</NavList>
          </div>
          
          <div className="panel-footer" style={{ padding: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
            <Link to="https://daonrs.com" target="_blank" rel="noopener noreferrer" onClick={closeAllMenus}>
              <img src={daoniLogo} alt="Daoni Logo" style={{ height: '30px' }} />
            </Link>
          </div>
        </div>
      </SidePanelWrapper>

      {(isMobileMenuOpen || isFullscreenNavOpen) && <Overlay onClick={closeAllMenus} />}
    </>
  );
};

export default Header;