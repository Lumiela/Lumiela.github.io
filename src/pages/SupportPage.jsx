import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Banner from '../components/Banner/Banner';
import SubNav from '../components/SubNav/SubNav';
import NoticeSection from '../sections/subsections/NoticeSection';
import DataroomSection from '../sections/subsections/DataroomSection';
import QnaSection from '../sections/subsections/QnaSection';
import homeBannerImage from '../assets/images/slider-01.jpg'; // 배너 이미지 재사용

const SupportPage = () => {
  return (
    <>
      <Banner title="고객센터" image={homeBannerImage} />
      <SubNav />
      <Routes>
        <Route path="/" element={<Navigate to="notice" />} />
        <Route path="notice" element={<NoticeSection />} />
        <Route path="dataroom" element={<DataroomSection />} />
        <Route path="qna" element={<QnaSection />} />
      </Routes>
    </>
  );
};

export default SupportPage;
