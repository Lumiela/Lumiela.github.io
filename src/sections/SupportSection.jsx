import React, { useState, forwardRef } from 'react';
import NoticeSection from './subsections/NoticeSection';
import DataroomSection from './subsections/DataroomSection';
import QnaSection from './subsections/QnaSection';
import supportContent from '../content/SupportContent.json'; // Import content
import {
  SupportTabsContainer,
  SupportTab,
  SupportContentContainer,
  SupportContentSection // Re-exporting from styles
} from './SupportSection.styles.js'; // Import styled components

const SupportSection = forwardRef((props, ref) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <NoticeSection />;
      case 1:
        return <DataroomSection />;
      case 2:
        return <QnaSection />;
      default:
        return null;
    }
  };

  return (
    <section id="support" className="section" ref={ref}>
      <div className="sub-section">
        <SupportTabsContainer>
          {supportContent.tabs.map((tab, index) => ( // Use content from JSON
            <SupportTab
              key={tab}
              className={activeTab === index ? 'active' : ''} // active class still used
              onClick={() => handleTabClick(index)}
            >
              {tab}
            </SupportTab>
          ))}
        </SupportTabsContainer>
        <SupportContentContainer>
          {renderContent()}
        </SupportContentContainer>
      </div>
    </section>
  );
});

export default SupportSection;