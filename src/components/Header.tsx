import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useUserSession } from '../hooks/useUserSession';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuthActions } from '../hooks/useAuthActions';
import { useAlert } from '../hooks/useAlert';
import QRCodeModal from './QRCodeModal';
import './Header.css';

interface HeaderProps {
  onKakaoLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onKakaoLoginClick }) => {
  const { storeName: urlStoreName } = useParams<{ storeName: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUserSession();
  const { role, storeName: profileStoreName } = useUserProfile(user);
  const { signOutUser } = useAuthActions();
  const { showAlert } = useAlert();
  
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 모바일 메뉴 상태

  // 페이지 이동 시 모바일 메뉴 자동으로 닫기
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOutUser();
    showAlert({
      type: 'success',
      title: '로그아웃 완료',
      message: '정상적으로 로그아웃 되었습니다.',
      onConfirm: () => navigate('/')
    });
  };

  const getStorePath = (path: string) => {
    return urlStoreName ? `/${urlStoreName}${path}` : path;
  };

  const targetStoreName = urlStoreName || profileStoreName;

  return (
    <>
    <header className="header">
      <div className="header-container">
        {/* 로고 영역 */}
        <div className="logo">
          <Link to="/">
            <img src="/app_icon.png" alt="약속해" className='logo_icon'/>
          </Link>
        </div>

        {/* 모바일 전용 토글 버튼 */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 열기"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* 네비게이션 및 유저 메뉴 (모바일에서는 Drawer 형태) */}
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            {urlStoreName && (
              <>
                <li><Link to={getStorePath("/booking")}>Booking</Link></li>
                <li><Link to={getStorePath("/portfolio")}>Portfolio</Link></li>
                {user && <li><Link to={getStorePath("/mypage")}>My Page</Link></li>}
              </>
            )}
            {role === 'admin' && (
              <li><a href="/admin" target="_blank" rel="noreferrer">Admin</a></li>
            )}
          </ul>

          <div className="auth-section">
            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-name">
                    {user.user_metadata.full_name || user.user_metadata.nickname}님
                  </span>
                  {role === 'owner' && <span className="owner-badge">사장님</span>}
                </div>
                <div className="button-group">
                  {role === 'owner' && (
                    <button className="qr-view-button" onClick={() => setIsQRModalOpen(true)}>
                      QR 보기
                    </button>
                  )}
                  <button className="logout-button" onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <button className="kakao-login-button" onClick={onKakaoLoginClick}>
                카카오로 로그인
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* 모바일 메뉴 열렸을 때 배경 어둡게 처리 (Overlay) */}
      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </header>
    
    {/* QR 코드 모달 */}
    {user && targetStoreName && (
      <QRCodeModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        storeName={targetStoreName}
        userId={user.id}
      />
    )}
    </>
  );
};

export default Header;