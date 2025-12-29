import React, { forwardRef } from 'react';

const ProductsSection = forwardRef((props, ref) => {
  return (
    <section id="products" className="section" ref={ref}>
      <h2>제품</h2>
      <p>스마트 측정 제어기, 탄산가스 발생기 등을 개발 및 판매합니다.</p>
    </section>
  );
});

export default ProductsSection;
