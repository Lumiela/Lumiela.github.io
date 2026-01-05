import React, { useRef, useMemo, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import DaoniFloatingButton from './components/DaoniFloatingButton';
import HomeSection from './sections/HomeSection';
import VisionSection from './sections/subsections/VisionSection';
import HistorySection from './sections/subsections/HistorySection';
import DirectionsSection from './sections/subsections/DirectionsSection';
import ScopeSection from './sections/subsections/ScopeSection';
import RndSection from './sections/subsections/RndSection';
import Product1Section from './sections/subsections/Product1Section';
import Product2Section from './sections/subsections/Product2Section';
import CaseExampleSection from './sections/subsections/CaseExampleSection';
import SupportSection from './sections/SupportSection';
import { useScrollSpy } from './hooks/useScrollSpy';
import './App.css';

const menuData = {
  about: { subMenus: [{ name: '경영비전', anchor: '#about-vision' }, { name: '회사연혁', anchor: '#about-history' }, { name: '오시는길', anchor: '#about-directions' }] },
  business: { subMenus: [{ name: '사업영역', anchor: '#business-scope' }, { name: '연구개발', anchor: '#business-rnd' }] },
  products: { subMenus: [{ name: '스마트 측정 제어기', anchor: '#products-product1' }, { name: '탄산가스 발생기', anchor: '#products-product2' }] },
  cases: { subMenus: [{ name: '구축사례', anchor: '#cases-example' }] },
  support: { subMenus: [{ name: '공지사항', anchor: '#support' }, { name: '자료실', anchor: '#support' }, { name: '문의하기', anchor: '#support' }] },
};

function App() {
  const [user, setUser] = useState(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const homeRef = useRef(null);
  const visionRef = useRef(null);
  const historyRef = useRef(null);
  const directionsRef = useRef(null);
  const scopeRef = useRef(null);
  const rndRef = useRef(null);
  const product1Ref = useRef(null);
  const product2Ref = useRef(null);
  const caseExampleRef = useRef(null);
  const supportRef = useRef(null);
  const footerRef = useRef(null);

  const sectionRefs = useMemo(() => [homeRef, visionRef, historyRef, directionsRef, scopeRef, rndRef, product1Ref, product2Ref, caseExampleRef, supportRef], []);
  const sectionIds = useMemo(() => ['home', 'about-vision', 'about-history', 'about-directions', 'business-scope', 'business-rnd', 'products-product1', 'products-product2', 'cases-example', 'support'], []);
  
  // useScrollSpy 옵션 수정: 화면 중앙 20% 영역을 기준으로 활성 섹션 감지하여 모바일 안정성 향상
  const activeSectionId = useScrollSpy(sectionRefs, { rootMargin: '-20% 0px -70% 0px' });

  // 현재 활성화된 하위 섹션 ID로부터 부모 메뉴 ID를 찾는 로직
  const getParentSectionId = (activeId) => {
    if (!activeId) return null;
    if (activeId.startsWith('about-')) return 'about';
    if (activeId.startsWith('business-')) return 'business';
    if (activeId.startsWith('products-')) return 'products';
    if (activeId.startsWith('cases-')) return 'cases';
    if (activeId.startsWith('support')) return 'support';
    return activeId; // 일치하는 부모가 없으면 ID 그대로 반환 (예: home)
  };
  const activeParentSectionId = getParentSectionId(activeSectionId) || 'home';

  useEffect(() => {
    // 세션 초기화 및 상태 변경 감지
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // footer가 10% 보일 때 상태 변경
    );

    const currentFooterRef = footerRef.current;
    if (currentFooterRef) {
      observer.observe(currentFooterRef);
    }

    return () => {
      subscription.unsubscribe();
      if (currentFooterRef) {
        observer.unobserve(currentFooterRef);
      }
    };
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

  const bottomNavItems = menuData[activeParentSectionId]?.subMenus || [];

  return (
    <div className="App">
      <Header 
        activeParentSectionId={activeParentSectionId}
        user={user} 
        onGoogleLogin={handleGoogleLogin} 
        onLogout={handleLogout} 
      />
      <main className="main-content">
        <HomeSection ref={homeRef} />
        <VisionSection ref={visionRef} />
        <HistorySection ref={historyRef} />
        <DirectionsSection ref={directionsRef} />
        <ScopeSection ref={scopeRef} />
        <RndSection ref={rndRef} />
        <Product1Section ref={product1Ref} />
        <Product2Section ref={product2Ref} />
        <CaseExampleSection ref={caseExampleRef} />
        <SupportSection ref={supportRef} />
      </main>
      {activeParentSectionId !== 'support' && <BottomNav items={bottomNavItems} activeSectionId={activeSectionId} isFooterVisible={isFooterVisible} />}
      <DaoniFloatingButton />
      <Footer ref={footerRef} />
    </div>
  );
}

export default App;