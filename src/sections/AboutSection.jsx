import React, { forwardRef } from 'react';

const AboutSection = forwardRef((props, ref) => {
  return (
    // 최상위 '회사소개' 섹션
    <section id="about" className="section" ref={ref}>
      <h2>회사소개</h2>
      <p>고객과 함께 성장하는 기업, (주)다온알에스입니다.</p>

      {/* 경영비전 하위 섹션 */}
      <div id="about-vision" className="sub-section">
        <h3>경영비전</h3>
        <p>도전정신과 창의성을 바탕으로 한 혁신 추구. 저희 (주)다온알에스는 고객의 성공을 최우선으로 생각하며, 끊임없이 새로운 기술과 서비스를 개발하여 더 나은 미래를 만들어갑니다.</p>
      </div>

      {/* 회사연혁 하위 섹션 */}
      <div id="about-history" className="sub-section">
        <h3>회사연혁</h3>
        <ul>
          <li>2020.01: (주)다온알에스 법인 설립</li>
          <li>2021.05: 스마트 측정 제어기 개발 완료</li>
          <li>2022.08: 탄산가스 발생기 특허 출원</li>
        </ul>
      </div>

      {/* 오시는길 하위 섹션 */}
      <div id="about-directions" className="sub-section">
        <h3>오시는길</h3>
        <p><strong>주소:</strong> 광주광역시 북구 용봉로 77, 전남대학교</p>
        <p><strong>연락처:</strong> 1811-6101</p>
      </div>
    </section>
  );
});

export default AboutSection;
