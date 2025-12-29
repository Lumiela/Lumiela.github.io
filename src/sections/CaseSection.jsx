import React, { forwardRef } from 'react';

const CaseSection = forwardRef((props, ref) => {
  return (
    <section id="cases" className="section" ref={ref}>
      <h2>적용사례</h2>
      <p>다양한 현장에 적용된 (주)다온알에스의 솔루션을 확인해보세요.</p>

      <div id="cases-example1" className="sub-section">
        <h3>스마트팜 온실 제어</h3>
        <p>최적의 생육 환경 조성을 위한 자동화 온실 제어 시스템 적용 사례입니다.</p>
      </div>
      <div id="cases-example2" className="sub-section">
        <h3>IoT 기반 공장 모니터링</h3>
        <p>생산 효율성 증대를 위한 실시간 공장 설비 모니터링 시스템 구축 사례입니다.</p>
      </div>
    </section>
  );
});

export default CaseSection;
