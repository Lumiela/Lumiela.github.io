import React, { forwardRef } from 'react';
import './AboutSubsections.css';

const HistorySection = forwardRef((props, ref) => {
  return (
    <section id="about-history" className="section" ref={ref}>
      <div className="sub-section">
        <h3>회사연혁</h3>
        <ul>
          <li>2020.01: (주)다온알에스 법인 설립</li>
          <li>2021.05: 스마트 측정 제어기 개발 완료</li>
          <li>2022.08: 탄산가스 발생기 특허 출원</li>
        </ul>
      </div>
    </section>
  );
});

export default HistorySection;
