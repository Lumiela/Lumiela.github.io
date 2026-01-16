import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Banner from '../components/Banner/Banner';
import SubNav from '../components/SubNav/SubNav';
import VisionSection from '../sections/subsections/VisionSection';
import HistorySection from '../sections/subsections/HistorySection';
import DirectionsSection from '../sections/subsections/DirectionsSection';
import homeBannerImage from '../assets/images/slider-01.jpg'; // 배너 이미지 재사용

const AboutPage = () => {
  return (
    <>
      <Banner title="회사소개" image={homeBannerImage} />
      <SubNav />
      <Routes>
        <Route path="/" element={<Navigate to="vision" />} />
        <Route path="vision" element={<VisionSection />} />
        <Route path="history" element={<HistorySection />} />
        <Route path="directions" element={<DirectionsSection />} />
      </Routes>
    </>
  );
};

export default AboutPage;
