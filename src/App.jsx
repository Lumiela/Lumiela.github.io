import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import BusinessPage from './pages/BusinessPage';
import ProductsPage from './pages/ProductsPage';
import CasesPage from './pages/CasesPage';
import SupportPage from './pages/SupportPage';
import './App.css';
import AdminTopNav from './components/AdminTopNav';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useAuth } from './contexts/AuthContext';
import MonitorPage from './pages/MonitorPage';

function App() {
  const { session, loading, isAdmin } = useAuth();
  const location = useLocation();
  const lenisRef = useRef(null);

  // 1. Lenis 초기화
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null; // 언마운트 시 참조 제거
    };
  }, []);

  // 2. 페이지 경로(URL)가 바뀔 때마다 100vh(화면 높이만큼) 이동
  useEffect(() => {
    // lenis 인스턴스가 존재하고, window 객체를 사용할 수 있을 때만 실행
    if (lenisRef.current && typeof window !== 'undefined') {
      const vh100 = window.innerHeight; // 현재 브라우저의 100vh 값 계산
      
      // 페이지 전환 시 즉시 100vh 지점으로 이동
      lenisRef.current.scrollTo(vh100, { immediate: true });
    }
  }, [location.pathname]);

  const isAdminPage = location.pathname.startsWith('/admin');
  const isMonitorPage = location.pathname.startsWith('/monitor');

  if (loading) {
    return <div>Loading...</div>;
  }

  // 관리자 레이아웃
  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin" element={session ? <AdminDashboardPage /> : <AdminLoginPage />} />
      </Routes>
    );
  }

  // 일반 사용자 레이아웃
  return (
    <div className={`App ${isAdmin ? 'admin-logged-in' : ''}`}>
      {isAdmin && <AdminTopNav />}
      {!isMonitorPage && <Header isAdmin={isAdmin} />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/about/vision" replace />} />
          <Route path="/about/*" element={<AboutPage />} />
          <Route path="/business/*" element={<BusinessPage />} />
          <Route path="/products/*" element={<ProductsPage />} />
          <Route path="/cases/*" element={<CasesPage />} />
          <Route path="/support/*" element={<SupportPage />} />
          <Route path="/monitor/*" element={<MonitorPage />} />
        </Routes>
      </main>

      {!isMonitorPage && <Footer />}
    </div>
  );
}

export default App;