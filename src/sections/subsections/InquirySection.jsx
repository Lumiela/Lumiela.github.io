import React, { forwardRef } from 'react';
import styled from 'styled-components';
import InquiryForm from '../../components/InquiryForm';
import '../SupportSection.css';

const SectionWrapper = styled.section`
  width: 100%;
`;

const InquirySection = forwardRef((props, ref) => {
  return (
    <SectionWrapper id="inquiry" ref={ref}>
      <div className="sub-section">
        <div className="support-content-section">
          <InquiryForm />
        </div>
      </div>
    </SectionWrapper>
  );
});

export default InquirySection;