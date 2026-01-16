import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Banner from '../components/Banner/Banner';
import SubNav from '../components/SubNav/SubNav';
import ScopeSection from '../sections/subsections/ScopeSection';
import RndSection from '../sections/subsections/RndSection';
import IntellectualPropertySection from '../sections/subsections/IntellectualPropertySection';
import homeBannerImage from '../assets/images/slider-01.jpg'; // 배너 이미지 재사용

const BusinessPage = () => {
  return (
    <>
      <Banner title="사업분야" image={homeBannerImage} />
      <SubNav />
      <Routes>
        <Route path="/" element={<Navigate to="scope" />} />
        <Route path="scope" element={<ScopeSection />} />
        <Route path="rnd" element={<RndSection />} />
        <Route path="ip" element={<IntellectualPropertySection />} />
      </Routes>
    </>
  );
};

export default BusinessPage;
