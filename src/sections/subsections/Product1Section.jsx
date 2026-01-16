import React, { forwardRef } from 'react';
import styled from 'styled-components';
import productImage1 from '../../assets/images/ec799f44001e51b2d01a4e98ec22278f_1644560652_3293.jpg';

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

const Product1Section = forwardRef((props, ref) => {
  return (
    <SectionWrapper id="product1" ref={ref}>
      <div className="sub-section">
        <ProductImage src={productImage1} alt="스마트 측정 제어기" />
      </div>
    </SectionWrapper>
  );
});

export default Product1Section;