import React from 'react';
import Banner from '../components/Banner/Banner';
import CaseExampleSection from '../sections/subsections/CaseExampleSection';
import homeBannerImage from '../assets/images/slider-01.jpg'; // 배너 이미지 재사용

const CasesPage = () => {
  return (
    <>
      <Banner title="적용사례" image={homeBannerImage} />
      <CaseExampleSection />
    </>
  );
};

export default CasesPage;
