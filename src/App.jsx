import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import HomeSection from './sections/HomeSection';
import VisionSection from './sections/subsections/VisionSection';
import HistorySection from './sections/subsections/HistorySection';
import DirectionsSection from './sections/subsections/DirectionsSection';
import ScopeSection from './sections/subsections/ScopeSection';
import RndSection from './sections/subsections/RndSection';
import IPWrapperSection from './sections/IPWrapperSection';
import Product1Section from './sections/subsections/Product1Section';
import Product2Section from './sections/subsections/Product2Section';
import CasesSection from './sections/CasesSection';
import SupportSection from './sections/SupportSection';
import { LenisProvider } from './contexts/LenisProvider';
import { useScrollSpy } from './hooks/useScrollSpy';
import './App.css';
import AdminTopNav from './components/AdminTopNav';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { supabase } from './supabaseClient';

const menuData = {
  home: { subMenus: [] },
  about: { subMenus: [{ name: '경영비전', anchor: '#about-vision' }, { name: '회사연혁', anchor: '#about-history' }, { name: '오시는길', anchor: '#about-directions' }] },
  business: { subMenus: [{ name: '사업영역', anchor: '#business-scope' }, { name: '연구개발', anchor: '#business-rnd' }, { name: '지식재산권 및 인증', anchor: '#business-ip' }] },
  products: { subMenus: [{ name: '스마트 측정 제어기', anchor: '#products-product1' }, { name: '탄산가스 발생기', anchor: '#products-product2' }] },
  cases: { subMenus: [{ name: '구축사례', anchor: '#cases' }] },
  support: { subMenus: [{ name: '공지사항', anchor: '#support' }, { name: '자료실', anchor: '#support' }, { name: '문의하기', anchor: '#support' }] },
};

const MainContent = React.forwardRef((props, ref) => {
  const { homeRef, visionRef, historyRef, directionsRef, scopeRef, rndRef, ipRef, product1Ref, product2Ref, casesRef, supportRef, activeParentSectionId, activeSectionId, subNavItems, isFooterVisible } = props;

  return (
    <>
      <Header activeParentSectionId={activeParentSectionId} subNavItems={subNavItems} activeSubSectionId={activeSectionId} />
      <main className="main-content">
        <section ref={homeRef} id="home"><HomeSection /></section>
        <section ref={visionRef} id="about-vision"><VisionSection /></section>
        <section ref={historyRef} id="about-history"><HistorySection /></section>
        <section ref={directionsRef} id="about-directions"><DirectionsSection /></section>
        <section ref={scopeRef} id="business-scope"><ScopeSection /></section>
        <section ref={rndRef} id="business-rnd"><RndSection /></section>
        <section ref={ipRef} id="business-ip"><IPWrapperSection /></section>
        <section ref={product1Ref} id="products-product1"><Product1Section /></section>
        <section ref={product2Ref} id="products-product2"><Product2Section /></section>
        <section ref={casesRef} id="cases"><CasesSection /></section>
        <section ref={supportRef} id="support"><SupportSection /></section>
      </main>
      {activeParentSectionId !== 'home' && activeParentSectionId !== 'support' && (
        <BottomNav items={subNavItems} activeSectionId={activeSectionId} isFooterVisible={isFooterVisible} />
      )}
      <Footer ref={ref} />
    </>
  );
});

function App() {
  const [view, setView] = useState('main');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState('home');

  const homeRef = useRef(null);
  const visionRef = useRef(null);
  const historyRef = useRef(null);
  const directionsRef = useRef(null);
  const scopeRef = useRef(null);
  const rndRef = useRef(null);
  const ipRef = useRef(null);
  const product1Ref = useRef(null);
  const product2Ref = useRef(null);
  const casesRef = useRef(null);
  const supportRef = useRef(null);
  const footerRef = useRef(null);

  const sectionRefs = useMemo(() => [homeRef, visionRef, historyRef, directionsRef, scopeRef, rndRef, ipRef, product1Ref, product2Ref, casesRef, supportRef], []);
  const sectionIds = useMemo(() => ['home', 'about-vision', 'about-history', 'about-directions', 'business-scope', 'business-rnd', 'business-ip', 'products-product1', 'products-product2', 'cases', 'support'], []);

  // 1. ScrollSpy 사용
  const spiedId = useScrollSpy(sectionRefs, { rootMargin: '-120px 0px -50% 0px' });

  // 2. 수동 섹션 감지 로직 (새로고침 시 실행)
  const detectSectionManually = useCallback(() => {
    const scrollPosition = window.scrollY + 150; // 여유값
    for (let i = sectionRefs.length - 1; i >= 0; i--) {
      const element = sectionRefs[i].current;
      if (element && scrollPosition >= element.offsetTop) {
        setActiveSectionId(sectionIds[i]);
        return;
      }
    }
    setActiveSectionId('home');
  }, [sectionRefs, sectionIds]);

  // 3. 스파이 업데이트 및 초기 로드 강제 실행
  useEffect(() => {
    if (spiedId) {
      setActiveSectionId(spiedId);
    }
  }, [spiedId]);

  useEffect(() => {
    // 페이지 로드 및 레이아웃 안정화 후 강제 감지
    const timer = setTimeout(detectSectionManually, 300);
    window.addEventListener('scroll', detectSectionManually, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', detectSectionManually);
    };
  }, [detectSectionManually]);

  const activeParentSectionId = useMemo(() => {
    const id = activeSectionId;
    if (!id || id === 'home') return 'home';
    if (id.startsWith('about-')) return 'about';
    if (id.startsWith('business-')) return 'business';
    if (id.startsWith('products-')) return 'products';
    if (id === 'cases') return 'cases';
    if (id === 'support') return 'support';
    return 'home';
  }, [activeSectionId]);

  const subNavItems = useMemo(() => menuData[activeParentSectionId]?.subMenus || [], [activeParentSectionId]);

  // Supabase & Footer Observer (기존 로직 유지)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (window.location.pathname === '/admin') setView(session ? 'adminDashboard' : 'adminLogin');
      setLoading(false);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (window.location.pathname === '/admin') setView(session ? 'adminDashboard' : 'adminLogin');
    });
    return () => subscription.unsubscribe();
  }, []);

  const [isFooterVisible, setIsFooterVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsFooterVisible(entry.isIntersecting), { threshold: 0.1 });
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (window.location.pathname.startsWith('/admin')) setView('adminLogin');
  };

  const renderContent = () => {
    if (loading) return <div>Loading...</div>;
    if (view === 'adminLogin') return <AdminLoginPage onLoginSuccess={() => setView('adminDashboard')} />;
    if (view === 'adminDashboard') return <AdminDashboardPage onLogout={handleLogout} />;
    return (
      <MainContent
        {...{homeRef, visionRef, historyRef, directionsRef, scopeRef, rndRef, ipRef, product1Ref, product2Ref, casesRef, supportRef, activeParentSectionId, activeSectionId, subNavItems, isFooterVisible}}
        ref={footerRef}
      />
    );
  };

  return (
    <LenisProvider>
      <div className={`App ${session ? 'admin-logged-in' : ''}`}>
        {session && view === 'main' && <AdminTopNav onLogout={handleLogout} onGoToDashboard={() => setView('adminDashboard')} />}
        {renderContent()}
      </div>
    </LenisProvider>
  );
}

export default App;