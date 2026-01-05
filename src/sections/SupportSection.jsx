import React, { useState, forwardRef } from 'react';
import NoticeSection from './subsections/NoticeSection';
import DataroomSection from './subsections/DataroomSection';
import QnaSection from './subsections/QnaSection';
import './SupportSection.css';

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
        <div className="support-tabs">
          {['공지사항', '자료실', '문의하기'].map((tab, index) => (
            <button
              key={tab}
              className={`support-tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleTabClick(index)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="support-content">
          {renderContent()}
        </div>
      </div>
    </section>
  );
});

export default SupportSection;

