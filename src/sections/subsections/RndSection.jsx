import React, { forwardRef } from 'react';
import styled from 'styled-components';
import rndImage from '../../assets/images/153967a69df72734c0b5d9845f6637ec_1588584439_0108.png';

const SectionWrapper = styled.section`
  /* Add any section-specific styles here if needed */
`;

const SubsectionTitleContainer = styled.div`
  text-align: center;
  margin: 50px 0;
  @media (max-width: 768px) {
    margin: 30px 0;
  }
`;

const SubsectionTitle = styled.p`
  font-size: 48px;
  font-weight: 800;
  color: #ff5e1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0;

  .quote {
    color: #555;
    font-family: serif;
  }

  @media (max-width: 768px) {
    font-size: 30px;
    gap: 5px;
  }
`;

const RndImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
`;

const RndSection = forwardRef((props, ref) => {
  return (
    <SectionWrapper id="rnd" ref={ref}>
      <div className="sub-section">
        <SubsectionTitleContainer>
          <SubsectionTitle>
            <span className="quote">“</span>
            연구개발
            <span className="quote">”</span>
          </SubsectionTitle>
        </SubsectionTitleContainer>
        <RndImage src={rndImage} alt="연구개발" />
      </div>
    </SectionWrapper>
  );
});

export default RndSection;