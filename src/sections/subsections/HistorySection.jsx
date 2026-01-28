import React, { forwardRef, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './HistorySection.css';

const HistorySection = forwardRef((props, ref) => {
  // 로컬 스토리지에서 이전 데이터를 불러와 초기 상태로 설정 (즉시 렌더링)
  const [historyData, setHistoryData] = useState(() => {
    const saved = localStorage.getItem('daonrs_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(historyData.length === 0); // 캐시가 있으면 로딩 미표시

  const title = "최적의 관리를 위한 Daonrs의 발자취 입니다 .";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('history')
          .select('*')
          .order('order_index', { ascending: false });

        if (!error && data) {
          setHistoryData(data);
          // 다음 방문을 위해 로컬 스토리지에 저장
          localStorage.setItem('daonrs_history', JSON.stringify(data));
        }
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalItems = historyData.length;

  const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const handleNext = () => setCurrentIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));

  // 데이터가 없고 로딩 중일 때 보여줄 스켈레톤 UI
  if (loading && totalItems === 0) {
    return (
      <section id="history" ref={ref} className="history-skeleton">
        <div className="sub-section">
          <div className="history-container">
            <div className="skeleton-header"></div>
            <div className="skeleton-content"></div>
          </div>
        </div>
      </section>
    );
  }

  // 데이터가 아예 없을 경우 섹션 자체를 숨김1
  if (totalItems === 0) return null;

  return (
    <section id="history" ref={ref}>
      <div className="sub-section">
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
      </div>
    </section>
  );
});

export default HistorySection;