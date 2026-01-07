import React, { forwardRef } from 'react';
import './HistorySection.css'; // CSS 파일 임포트
import './BusinessSubsections.css';

const HistorySection = forwardRef((props, ref) => {
  // 연혁 데이터를 배열로 구조화
  const historyData = [
    { date: '2020.01', description: '(주)다온알에스 법인 설립' },
    { date: '2021.05', description: '스마트 측정 제어기 개발 완료' },
    { date: '2022.08', description: '탄산가스 발생기 특허 출원' },
    // 필요시 여기에 더 많은 연혁 항목 추가
  ];

  return (
    <section id="about-history" className="section" ref={ref}>
      <div className="sub-section">
        <div className="subsection-title-container">
          <p className="subsection-title">
            <span className="quote">“</span>
            회사연혁
            <span className="quote">”</span>
          </p>
        </div>
        <div className="timeline">
          {historyData.map((item, index) => (
            <div className="timeline-item" key={index}>
              <div className="timeline-dot"></div>
              <div className="timeline-date">{item.date}</div>
              <div className="timeline-content">
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HistorySection;
