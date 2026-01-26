import React, { forwardRef, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './HistorySection.css'; // Import the new CSS file

const HistorySection = forwardRef((props, ref) => {
  const [historyData, setHistoryData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const title = "최적의 관리를 위한 Daonrs의 발자취 입니다 .";

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
    <section id="history" ref={ref} className="sub-section">
      <div className="history-container">
        <div className="section-header">
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
          <div className="navigation">
            <span className="page-num">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
            </span>
            <div className="nav-buttons">
              <button onClick={handlePrev} disabled={currentIndex === 0}>〈</button>
              <button onClick={handleNext} disabled={currentIndex >= totalItems - 1}>〉</button>
            </div>
          </div>
        </div>

        <div className="timeline-wrapper">
          <div className="timeline-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {historyData.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot dot" />
                <h3 className="year-title year">{item.year}</h3>
                <ul className="event-list">
                  {item.events?.map((event, i) => (
                    <li key={i}>
                      <span className="month">{event.month}</span>
                      <span className="content">{event.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default HistorySection;