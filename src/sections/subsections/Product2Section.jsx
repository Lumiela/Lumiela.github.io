import React, { forwardRef } from 'react';
import styled from 'styled-components';
import productImage2 from '../../assets/images/ec799f44001e51b2d01a4e98ec22278f_1644560772_8999.jpg';

const SectionWrapper = styled.section`
  .sub-section {
    padding: 20px;
    text-align: center;
  }
`;

const ProductImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
`;

const Product2Section = forwardRef((props, ref) => {
  return (
    <SectionWrapper id="product2" ref={ref}>
      <div className="sub-section">
        <ProductImage src={productImage2} alt="탄산가스 발생기" />
      </div>
    </SectionWrapper>
  );
});

export default Product2Section;