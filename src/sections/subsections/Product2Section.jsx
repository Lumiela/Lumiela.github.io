import React, { forwardRef } from 'react';
import './ProductsSubsections.css';
import productImage2 from '../../assets/images/ec799f44001e51b2d01a4e98ec22278f_1644560772_8999.jpg';

const Product2Section = forwardRef((props, ref) => {
  return (
    <section id="products-product2" className="section" ref={ref}>
      <div className="sub-section">
        <img src={productImage2} alt="탄산가스 발생기" className="product-image" />
      </div>
    </section>
  );
});

export default Product2Section;
