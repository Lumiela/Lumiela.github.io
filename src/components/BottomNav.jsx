import React from 'react';

const BottomNav = ({ items, activeSectionId }) => { // activeSectionId prop 받도록 수정
  // items가 비어있으면 아무것도 렌더링하지 않음
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="bottom-nav">
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
