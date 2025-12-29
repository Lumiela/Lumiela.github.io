import React, { forwardRef } from 'react';

const BusinessSection = forwardRef((props, ref) => {
  return (
    <section id="business" className="section" ref={ref}>
      <h2>사업분야</h2>
      <p>창의적인 기술로 새로운 가치를 창출합니다.</p>

      {/* 사업영역 하위 섹션 */}
      <div id="business-scope" className="sub-section">
        <h3>사업영역</h3>
        <p>1. 스마트팜 솔루션: 최적의 생육환경을 제공하는 스마트팜 시스템을 구축합니다.</p>
        <p>2. 과학기기: 정밀 분석 및 실험을 위한 고성능 과학기기를 공급합니다.</p>
        <p>3. 맞춤형 제어 시스템: 고객의 요구사항에 최적화된 제어 시스템을 개발합니다.</p>
      </div>

      {/* 연구개발 하위 섹션 */}
      <div id="business-rnd" className="sub-section">
        <h3>연구개발</h3>
        <p>국가 R&D 과제 수행 및 산학연 공동 연구를 통해 핵심 기술을 개발하고 있습니다.</p>
      </div>
    </section>
  );
});

export default BusinessSection;
