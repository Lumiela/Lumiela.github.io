import React from 'react';
import './BottomNav.css';

const BottomNav = ({ items, activeSectionId, isFooterVisible }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const navClassName = `bottom-nav ${isFooterVisible ? 'footer-visible' : ''}`;

  return (
    <nav className={navClassName}>
      <ul>
        {items.map(item => (
          <li key={item.name}>
            <a
              href={item.anchor}
              className={item.anchor.substring(1) === activeSectionId ? 'active' : ''}
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
