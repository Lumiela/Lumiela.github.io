import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Banner from '../components/Banner/Banner';
import SubNav from '../components/SubNav/SubNav';
import CaseExampleSection from '../sections/subsections/CaseExampleSection';
import bannerImages from '../content/bannerImages.js';

const CasesPage = () => {
  const { title, subtitle, image } = bannerImages['/cases'];

  return (
    <>
      <Banner title={title} subtitle={subtitle} image={image} />
      <SubNav />
      <Routes>
        <Route path="/" element={<Navigate to="example" />} />
        <Route path="example" element={<CaseExampleSection />} />
      </Routes>
    </>
  );
};

export default CasesPage;
