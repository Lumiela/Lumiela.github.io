import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Portfolio from './components/Portfolio';
import Booking from './components/Booking';
import Contact from './components/Contact';
import MyPage from './components/MyPage'; // 신규 추가
import Admin from './components/Admin'; // 관리자 페이지 추가
import NotFound from './components/NotFound'; // 잘못된 페이지 추가
import StoreLayout from './components/StoreLayout';
import LandingPage from './components/LandingPage';
import KakaoLoginModal from './components/KakaoLoginModal';
import { AlertProvider } from './hooks/useAlert';

const App: React.FC = () => {
  const [isKakaoLoginModalOpen, setIsKakaoLoginModalOpen] = useState(false);

  const handleKakaoLoginClick = () => {
    setIsKakaoLoginModalOpen(true);
  };

  return (
    <AlertProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage onKakaoLoginClick={handleKakaoLoginClick} />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/:storeName" element={<StoreLayout onKakaoLoginClick={handleKakaoLoginClick} />}>
            <Route index element={<Home />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="booking" element={<Booking />} />
            <Route path="contact" element={<Contact />} />
            <Route path="mypage" element={<MyPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <KakaoLoginModal 
          isOpen={isKakaoLoginModalOpen} 
          onClose={() => setIsKakaoLoginModalOpen(false)} 
        />
      </div>
    </AlertProvider>
  );
};

export default App;