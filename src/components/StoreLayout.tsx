import React, { useEffect, useState } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ContactButton from './ContactButton';
import ContactModal from './ContactModal';
import { supabase } from '../supabaseClient';

interface StoreLayoutProps {
  onKakaoLoginClick: () => void;
}

const StoreLayout: React.FC<StoreLayoutProps> = ({ onKakaoLoginClick }) => {
  const { storeName } = useParams<{ storeName: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isValidStore, setIsValidStore] = useState<boolean | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // 현재 경로가 홈 페이지인지 확인 (예: /decodedStoreName)
  const isHomePage = pathname === `/${storeName}` || pathname === `/${storeName}/`;

  useEffect(() => {
    const validateStore = async () => {
      if (!storeName) {
        setIsValidStore(false);
        return;
      }

      const decodedStoreName = decodeURIComponent(storeName);
      console.log("--- 스토어 검증 시작 ---");
      console.log("URL 파라미터 (원문):", storeName);
      console.log("URL 파라미터 (디코딩):", decodedStoreName);

      try {
        const { data, error } = await supabase
          .from('public_store_info') // 안전한 뷰(View)에서 조회
          .select('id, store_name, role')
          .eq('store_name', decodedStoreName)
          .maybeSingle();

        if (error) {
          console.error('스토어 검증 에러:', error);
          setIsValidStore(false);
          return;
        }

        console.log("DB 조회 결과:", data);

        if (data) {
          if (data.role === 'owner') {
            setIsValidStore(true);
            setOwnerId(data.id);
          } else {
            console.warn("스토어는 찾았으나 사용자의 권한이 'owner'가 아님. 현재 권한:", data.role);
            setIsValidStore(false);
          }
        } else {
          console.warn("해당 이름의 스토어를 찾을 수 없음.");
          setIsValidStore(false);
        }
      } catch (err) {
        console.error('검증 로직 중 예외 발생:', err);
        setIsValidStore(false);
      }
    };

    validateStore();
  }, [storeName]);

  // 리디렉션 로직을 useEffect로 분리 (렌더링 중 navigate 호출 방지)
  useEffect(() => {
    if (isValidStore === false) {
      alert('존재하지 않거나 유효하지 않은 스토어 주소입니다.');
      navigate('/', { replace: true });
    }
  }, [isValidStore, navigate]);

  if (isValidStore === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>스토어 정보를 확인 중입니다...</p>
      </div>
    );
  }

  // 유효하지 않을 때는 null을 반환하고 위 useEffect에서 리디렉션 처리
  if (isValidStore === false) return null;

  return (
    <div className={`store-layout ${isHomePage ? 'home-no-scroll' : ''}`}>
      <Header onKakaoLoginClick={onKakaoLoginClick} />
      <main>
        {/* ownerId를 하위 라우트에 전달합니다. */}
        <Outlet context={{ storeName, ownerId }} />
      </main>
      <Footer ownerId={ownerId} transparent={isHomePage} />
      <ContactButton onClick={() => setIsContactModalOpen(true)} />
      
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default StoreLayout;
