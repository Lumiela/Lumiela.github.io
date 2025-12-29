import React, { forwardRef } from 'react';

const HomeSection = forwardRef((props, ref) => {
  return (
    <section id="home" className="section" ref={ref}>
      <h1>(주)다온알에스</h1>
      <p>혁신적인 기술로 미래를 선도합니다.</p>
    </section>
  );
});

export default HomeSection;
