import React from 'react';
import './BottomNav.css';

const BottomNav = ({ items, activeSectionId, isFooterVisible, activeParentSectionId, activeSupportTab, onSupportTabClick }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const navClassName = `bottom-nav ${isFooterVisible ? 'footer-visible' : ''}`;

  const handleItemClick = (e, item) => {
    if (activeParentSectionId === 'support') {
      e.preventDefault(); // 기본 앵커 동작 방지
      onSupportTabClick(item.id);
    }
    // 다른 섹션에서는 기본 href 동작(스크롤)을 그대로 수행
  };

  return (
    <nav className={navClassName}>
      <ul>
        {items.map(item => (
          <li key={item.name}>
            <a
              href={item.anchor}
              onClick={(e) => handleItemClick(e, item)}
              className={
                activeParentSectionId === 'support'
                  ? item.id === activeSupportTab ? 'active' : ''
                  : item.anchor.substring(1) === activeSectionId ? 'active' : ''
              }
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
