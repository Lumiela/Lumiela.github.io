import React, { forwardRef } from 'react';

const SupportSection = forwardRef((props, ref) => {
  return (
    <section id="support" className="section" ref={ref}>
      <h2>고객센터</h2>
      <p>문의 사항이나 기술 지원이 필요하시면 언제든지 연락 주세요.</p>

      <div id="support-notice" className="sub-section">
        <h3>공지사항</h3>
        <ul>
          <li>시스템 점검 안내 (2025-12-31)</li>
          <li>신제품 출시 예정 (2026-01-15)</li>
        </ul>
      </div>
      <div id="support-qna" className="sub-section">
        <h3>문의해보세요</h3>
        <p>궁금한 점이 있으시면 언제든지 1811-6101로 연락 주시거나, 이메일(thankyou@daonrs.kr)로 문의해주세요.</p>
      </div>
    </section>
  );
});

export default SupportSection;
