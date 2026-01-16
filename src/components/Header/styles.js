import styled from 'styled-components';

export const HeaderContainer = styled.header`
  position: fixed;
  top: ${({ $visible, $isAdmin }) => ($visible ? ($isAdmin ? '42px' : '0') : '-100px')};
  left: 0;
  width: 100%;
  background-color: #FFFFFF;
  z-index: 1040;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: top 0.3s ease-in-out;
  height: 60px;
`;

export const HeaderInner = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; height: 100%; padding: 0 40px; @media (max-width: 480px) { padding: 0 15px; }
`;

export const LogoContainer = styled.div` img { height: 35px; display: block; } `;

export const DesktopNavContainer = styled.nav`
  display: none;
  @media (min-width: 1024px) {
    display: flex; height: 100%; flex-grow: 1; justify-content: center;
    .main-menu-list { display: flex; list-style: none; height: 100%; }
    .main-menu-item { position: relative; display: flex; align-items: center; }
    span, a { padding: 0 25px; color: #333; text-decoration: none; font-weight: 600; font-size: 1.1rem; &.active { color: #007bff; } }
  }
`;

export const DropdownMenu = styled.div`
  position: absolute; top: 60px; left: 50%; transform: translateX(-50%);
  width: 160vw; background: #fff; border-top: 1px solid #eee; border-bottom: 1px solid #eee;
  display: flex; justify-content: center; z-index: 1000;
  ul { display: flex; list-style: none; padding: 15px 0; gap: 30px; }
  a { font-size: 1rem; color: #666; font-weight: 500; text-decoration: none; &:hover { color: #007bff; } }
`;

export const HamburgerMenu = styled.button`
  background: none; border: none; cursor: pointer; z-index: 1041; padding: 10px;
  .bar { width: 24px; height: 2px; background-color: #333; margin: 5px 0; display: block; }
`;

export const CloseButton = styled.button`
  background: none; border: none; cursor: pointer; position: relative; width: 30px; height: 30px;
  span { position: absolute; width: 24px; height: 2px; background-color: #333; left: 3px; }
  span:nth-child(1) { transform: rotate(45deg); }
  span:nth-child(2) { transform: rotate(-45deg); }
`;

// 모바일 전용: 우측 슬라이드 패널
export const SidePanelWrapper = styled.div`
  position: fixed; top: 0; right: 0; width: 100vw; height: 100vh; background: #fff; z-index: 2100;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); overflow-y: auto;
  .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 0 20px; height: 60px; border-bottom: 1px solid #f0f0f0; }
  .panel-content { padding: 40px 25px; }
`;

// 데스크톱 전용: 풀스크린 (기존 스타일 유지)
export const FullscreenNavWrapper = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: block; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #ffffff; z-index: 2500;
    opacity: ${props => props.$isOpen ? '1' : '0'}; visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: all 0.4s ease; overflow-y: auto;
    .fullscreen-header { display: flex; justify-content: space-between; align-items: center; padding: 0 40px; height: 60px; border-bottom: 1px solid #f0f0f0; }
    .fullscreen-content { padding: 60px 10%; }
  }
`;

export const NavList = styled.nav`
  width: 100%;
  ul { list-style: none; margin: 0; padding: 0; }

  /* 모바일 스타일: 아코디언 + 가로배치 */
  ${props => !props.$isDesktop && `
    & > ul > li { border-bottom: 1px solid #f5f5f5; padding: 25px 0; }
    .menu-title-btn, a { font-size: 1.8rem; font-weight: 800; color: #000; background: none; border: none; text-align: left; width: 100%; text-decoration: none; padding: 0; }
    .submenu {
      display: flex; flex-wrap: wrap; gap: 10px 15px; max-height: 0; opacity: 0; overflow: hidden; transition: all 0.3s;
      &.show { max-height: 300px; opacity: 1; margin-top: 20px; }
      a { font-size: 1.1rem; color: #666; font-weight: 500; padding: 8px 15px; background: #f8f9fa; border-radius: 5px; width: auto; }
    }
  `}

  /* 데스크톱 스타일: 기존 레이아웃 유지 */
  ${props => props.$isDesktop && `
    & > ul > li { border-bottom: 1px solid #eeeeee; padding: 40px 0; }
    .main-menu-group { display: flex; align-items: flex-start; }
    .main-menu-item { width: 300px; font-size: 2.2rem; font-weight: 800; }
    .submenu { display: flex; flex-direction: row; flex-wrap: wrap; gap: 20px 40px; padding-left: 40px; 
      a { font-size: 1.2rem; color: #666; text-decoration: none; &:hover { color: #007bff; } } }
  `}
`;

export const Overlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000;
`;