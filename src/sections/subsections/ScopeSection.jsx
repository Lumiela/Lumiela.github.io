import React, { forwardRef } from 'react';
import styled from 'styled-components';
import businessScopeImage from '../../assets/images/21_h.jpg';

const SectionWrapper = styled.section`
  /* Add any section-specific styles here if needed */
`;

const BusinessAreaImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
`;

const ScopeSection = forwardRef((props, ref) => {
  return (
    <SectionWrapper id="scope" ref={ref}>
      <div className="sub-section">
        <BusinessAreaImage src={businessScopeImage} alt="사업 영역" />
      </div>
    </SectionWrapper>
  );
});

export default ScopeSection;