import React, { useState } from 'react';
import './KakaoLoginModal.css';
import { useAuthActions } from '../hooks/useAuthActions';
import BaseModal from './BaseModal';

interface KakaoLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KakaoLoginModal: React.FC<KakaoLoginModalProps> = ({ isOpen, onClose }) => {
  const { signInWithKakao } = useAuthActions();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  if (!isOpen) return null;

  const handleKakaoLogin = async () => {
    await signInWithKakao();
  };

  // 약관 내용
  const termsContent = (
    <div className="policy-content">
      <h4>제 1 조 (목적)</h4>
      <p>본 약관은 NLAPS(이하 "회사")가 제공하는 예약 및 포트폴리오 관리 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
      <h4>제 2 조 (서비스의 제공)</h4>
      <p>회사는 예약 관리 시스템, 포트폴리오 게시판, QR 코드 생성 등 사장님들을 위한 관리 솔루션을 제공합니다.</p>
    </div>
  );

  const privacyContent = (
    <div className="policy-content">
      <h4>1. 수집하는 개인정보 항목</h4>
      <p>회사는 카카오 로그인을 통해 닉네임, 프로필 사진 정보를 수집합니다.</p>
      <h4>2. 수집 및 이용 목적</h4>
      <p>수집된 정보는 회원 관리, 예약 확인 및 알림 서비스 제공을 위해 활용됩니다.</p>
      <h4>3. 보유 및 이용 기간</h4>
      <p>개인정보는 회원 탈퇴 시까지 보유하며, 탈퇴 시 즉시 파기합니다.</p>
    </div>
  );

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="400px">
        <div className="kakao-login-container">
          <div className="login-header">
            <div className="app-logo-circle">
              <img src="/app_icon.png" alt="App Logo" />
            </div>
            <h2 className="login-title">반가워요!</h2>
            <p className="login-subtitle">
              카카오 계정으로 간편하게 로그인하고<br />
              나만의 예약 스토어를 관리해 보세요.
            </p>
          </div>

          <button className="kakao-login-btn" onClick={handleKakaoLogin}>
            <svg className="kakao-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.712 4.8 4.37 6.13-.19.64-.683 2.316-.782 2.677-.123.45.153.444.322.332.133-.088 2.122-1.442 2.964-2.016.368.05.744.077 1.126.077 4.97 0 9-3.186 9-7.115C21 6.185 16.97 3 12 3z" fill="currentColor"/>
            </svg>
            카카오 로그인 시작
          </button>

          <div className="login-footer">
            <p className="consent-text">
              로그인 버튼을 클릭함으로써<br />
              <span className="link" onClick={() => setIsTermsOpen(true)}>이용약관</span> 및 
              <span className="link" onClick={() => setIsPrivacyOpen(true)}>개인정보 처리방침</span>에<br />
              동의하게 됩니다.
            </p>
          </div>
        </div>
      </BaseModal>

      <BaseModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} title="서비스 이용약관">
        {termsContent}
      </BaseModal>

      <BaseModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} title="개인정보 처리방침">
        {privacyContent}
      </BaseModal>
    </>
  );
};

export default KakaoLoginModal;
