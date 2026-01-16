import React, { forwardRef, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
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
  const [historyData, setHistoryData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const title = "정밀한 생장 분석과 자동화 기술을 기반으로,\n한국표준육묘는 농업 혁신의 길을 꾸준히 걸어왔습니다.";

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        // order_index가 큰 순서대로 불러와서 0번 인덱스(왼쪽)가 최신이 되게 함
        .order('order_index', { ascending: false }); 

      if (!error && data) {
        setHistoryData(data);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const totalItems = historyData.length;

  const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const handleNext = () => setCurrentIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));

  if (loading || totalItems === 0) return null;

  return (
    <section id="history" ref={ref} style={{ backgroundColor: '#fff' }}>
      <HistoryContainer>
        <SectionHeader>
          <div>
            <h2>회사 연혁</h2>
            <div className="main-title">
              {title.split('\n').map((text, i) => (
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
          <TimelineTrack style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {historyData.map((item) => (
              <TimelineItem key={item.id}>
                <TimelineDot className="dot" />
                <YearTitle className="year">{item.year}</YearTitle>
                <EventList>
                  {item.events?.map((event, i) => (
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