import React, { useRef, useMemo, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import HomeSection from './sections/HomeSection';
import AboutSection from './sections/AboutSection';
import BusinessSection from './sections/BusinessSection';
import ProductsSection from './sections/ProductsSection';
import CaseSection from './sections/CaseSection';
import SupportSection from './sections/SupportSection';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useScrollSnap } from './hooks/useScrollSnap';
import './App.css';

const menuData = {
  about: { subMenus: [{ name: '경영비전', anchor: '#about-vision' }, { name: '회사연혁', anchor: '#about-history' }, { name: '오시는길', anchor: '#about-directions' }] },
  business: { subMenus: [{ name: '사업영역', anchor: '#business-scope' }, { name: '연구개발', anchor: '#business-rnd' }] },
  cases: { subMenus: [{ name: '온실 제어', anchor: '#cases-example1' }, { name: '공장 모니터링', anchor: '#cases-example2' }] },
  support: { subMenus: [{ name: '공지사항', anchor: '#support-notice' }, { name: '문의하기', anchor: '#support-qna' }] },
};

function App() {
  const [user, setUser] = useState(null);
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const businessRef = useRef(null);
  const productsRef = useRef(null);
  const caseRef = useRef(null);
  const supportRef = useRef(null);

  const sectionRefs = useMemo(() => [homeRef, aboutRef, businessRef, productsRef, caseRef, supportRef], []);
  const sectionIds = useMemo(() => ['home', 'about', 'business', 'products', 'cases', 'support'], []);
  
  // useScrollSpy 옵션 수정: 화면 중앙 20% 영역을 기준으로 활성 섹션 감지하여 모바일 안정성 향상
  const activeSectionId = useScrollSpy(sectionRefs, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
  
  // useScrollSnap 훅 호출로 스크롤 스냅 기능 활성화
  useScrollSnap(activeSectionId, sectionIds, { headerOffset: 80 });

  useEffect(() => {
    // 세션 초기화 및 상태 변경 감지
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const bottomNavItems = menuData[activeSectionId]?.subMenus || [];

  return (
    <div className="App">
      <Header 
        activeSectionId={activeSectionId} 
        user={user} 
        onGoogleLogin={handleGoogleLogin} 
        onLogout={handleLogout} 
      />
      <main className="main-content">
        <HomeSection ref={homeRef} />
        <AboutSection ref={aboutRef} />
        <BusinessSection ref={businessRef} />
        <ProductsSection ref={productsRef} />
        <CaseSection ref={caseRef} />
        <SupportSection ref={supportRef} />
      </main>
      <BottomNav items={bottomNavItems} activeSectionId={activeSectionId} />
      <Footer />
    </div>
  );
}

export default App;