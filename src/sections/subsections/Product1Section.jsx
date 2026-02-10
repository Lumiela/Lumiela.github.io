import React, { forwardRef } from 'react';
import productImage1 from '../../assets/images/ec799f44001e51b2d01a4e98ec22278f_1644560652_3293.jpg';
import './Product1Section.css';

const Product1Section = forwardRef((props, ref) => {
  return (
    <section id="product1" ref={ref} className="section">
      <div className="sub-section">
        <header className="subsection-header">
          <h2 className="subsection-title">다오니</h2>
        </header>
        <hr className="section-top-line" />
        <img src={productImage1} alt="스마트 측정 제어기" className="product1-image" />
      </div>
    </section>
  );
});

export default Product1Section;