import React, { forwardRef } from 'react';
import styled from 'styled-components';
import visionImage from '../../assets/images/11_h.jpg';

const SectionWrapper = styled.section`
  /* The sub-section class can be handled by simple padding or can be a separate component if it gets more complex */
`;

const VisionImage = styled.img`
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;

const VisionSection = forwardRef((props, ref) => {
  return (
    <SectionWrapper id="vision" ref={ref}>
      <div className="sub-section"> {/* This class can be styled or removed if not needed */}
        <VisionImage src={visionImage} alt="경영 비전" />
      </div>
    </SectionWrapper>
  );
});

export default VisionSection;