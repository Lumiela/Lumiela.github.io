import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Banner from '../components/Banner/Banner';
import SubNav from '../components/SubNav/SubNav';
import CaseExampleSection from '../sections/subsections/CaseExampleSection';
import homeBannerImage from '../assets/images/slider-01.jpg'; // 배너 이미지 재사용

const CasesPage = () => {
  return (
    <>
      <Banner title="적용사례" image={homeBannerImage} />
      <SubNav />
      <Routes>
        <Route path="/" element={<Navigate to="example" />} />
        <Route path="example" element={<CaseExampleSection />} />
      </Routes>
    </>
  );
};

export default CasesPage;
