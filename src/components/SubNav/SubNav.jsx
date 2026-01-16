import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { menuItems } from '../../content/menuData';
import { SubNavContainer } from './SubNav.styles';

const SubNav = () => {
  const location = useLocation();
  // 현재 URL 경로가 메뉴 아이템의 경로로 시작하는지 확인하여 현재 메뉴 아이템을 찾습니다.
  const currentMenuItem = menuItems.find(item => location.pathname.startsWith(item.path) && item.path !== '/');

  if (!currentMenuItem || !currentMenuItem.subMenus) {
    return null;
  }

  return (
    <SubNavContainer>
      <ul>
        {currentMenuItem.subMenus.map(subItem => (
          <li key={subItem.name}>
            <NavLink 
              to={`${currentMenuItem.path}/${subItem.path}`}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {subItem.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </SubNavContainer>
  );
};

export default SubNav;