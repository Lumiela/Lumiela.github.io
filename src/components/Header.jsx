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

  // 모바일 전용 네비게이션 링크 (아코디언 + 가로배치)
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

  // 데스크톱 풀스크린 전용 네비게이션 링크 (기존 스타일 유지)
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
            <Link to="/" onClick={closeAllMenus}><img src={logo} alt="Logo" /></Link>
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

          <HamburgerMenu onClick={toggleMenu}><div className="bar"></div><div className="bar"></div><div className="bar"></div></HamburgerMenu>
        </HeaderInner>
      </HeaderContainer>

      {/* 데스크톱 전용 풀스크린 (상단 고정 메뉴) */}
      <FullscreenNavWrapper $isOpen={isFullscreenNavOpen}>
        <div className="fullscreen-header">
           <LogoContainer><Link to="/" onClick={closeAllMenus}><img src={logo} alt="Logo" /></Link></LogoContainer>
           <CloseButton onClick={closeAllMenus}><span></span><span></span></CloseButton>
        </div>
        <div className="fullscreen-content"><NavList $isDesktop={true}>{desktopNavLinks}</NavList></div>
      </FullscreenNavWrapper>

      {/* 모바일 전용 사이드 패널 (우측에서 등장) */}
      <SidePanelWrapper $isOpen={isMobileMenuOpen}>
        <div className="panel-header">
          <LogoContainer><Link to="/" onClick={closeAllMenus}><img src={logo} alt="Logo" /></Link></LogoContainer>
          <CloseButton onClick={closeAllMenus}><span></span><span></span></CloseButton>
        </div>
        <div className="panel-content"><NavList $isDesktop={false}>{mobileNavLinks}</NavList></div>
      </SidePanelWrapper>

      {(isMobileMenuOpen || isFullscreenNavOpen) && <Overlay onClick={closeAllMenus} />}
    </>
  );
};

export default Header;