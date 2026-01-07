import React, { forwardRef } from 'react';
import './ProductsSubsections.css';
import productImage1 from '../../assets/images/ec799f44001e51b2d01a4e98ec22278f_1644560652_3293.jpg';

const Product1Section = forwardRef((props, ref) => {
  return (
    <section id="products-product1" className="section" ref={ref}>
      <div className="sub-section">
        <img src={productImage1} alt="스마트 측정 제어기" className="product-image" />
      </div>
    </section>
  );
});

export default Product1Section;
