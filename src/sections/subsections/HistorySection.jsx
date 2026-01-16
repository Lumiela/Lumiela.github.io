import React, { forwardRef, useState } from 'react';
import content from '../../content/HistoryContent.json';
import {
  HistoryContainer,
  SectionHeader,
  Navigation,
  TimelineWrapper,
  TimelineTrack,
  TimelineItem,
  TimelineDot,
  YearTitle,
  EventList
} from './styles/HistorySection.styles.js';

const HistorySection = forwardRef((props, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = content.history.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
  };

  return (
    <section id="history" ref={ref} style={{ backgroundColor: '#fff' }}>
      <HistoryContainer>
        <SectionHeader>
          <div>
            <h2>회사 연혁</h2>
            <div className="main-title">
              {content.title.split('\n').map((text, i) => (
                <React.Fragment key={i}>
                  {text} <br />
                </React.Fragment>
              ))}
            </div>
          </div>
          <Navigation>
            <span className="page-num">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
            </span>
            <div className="nav-buttons">
              <button onClick={handlePrev} disabled={currentIndex === 0}>〈</button>
              <button onClick={handleNext} disabled={currentIndex >= totalItems - 1}>〉</button>
            </div>
          </Navigation>
        </SectionHeader>

        <TimelineWrapper>
          {/* 100% 단위를 사용하여 데스크톱에서도 한 섹션씩 이동 */}
          <TimelineTrack style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {content.history.map((item, index) => (
              <TimelineItem key={index}>
                <TimelineDot className="dot" />
                <YearTitle className="year">{item.year}</YearTitle>
                <EventList>
                  {item.events.map((event, i) => (
                    <li key={i}>
                      <span className="month">{event.month}</span>
                      <span className="content">{event.content}</span>
                    </li>
                  ))}
                </EventList>
              </TimelineItem>
            ))}
          </TimelineTrack>
        </TimelineWrapper>
      </HistoryContainer>
    </section>
  );
});

export default HistorySection;