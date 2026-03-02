import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Layout, 
  Smartphone, 
  Zap, 
  CheckCircle, 
  PlusCircle,
  ArrowRight,
  QrCode,
  Image as ImageIcon
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import BecomeOwnerModal from './BecomeOwnerModal';
import ContactButton from './ContactButton';
import ContactModal from './ContactModal';
import { useUserSession } from '../hooks/useUserSession';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAlert } from '../hooks/useAlert';
import './LandingPage.css';

interface LandingPageProps {
  onKakaoLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onKakaoLoginClick }) => {
  const navigate = useNavigate();
  const { user } = useUserSession();
  const { role, storeName, applicationStatus, refreshProfile } = useUserProfile(user);
  const { showAlert } = useAlert();
  const [isBecomeOwnerModalOpen, setIsBecomeOwnerModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const getOwnerButtonContent = () => {
    if (role === 'owner') return "내 스토어로 이동";
    if (applicationStatus === 'pending') return "⏳ 승인 심사 중";
    return "1분 만에 무료 시작하기";
  };

  const isOwnerButtonDisabled = applicationStatus === 'pending';

  const handleBecomeOwnerClick = () => {
    if (!user) {
      showAlert({
        type: 'info',
        title: '로그인 필요',
        message: '서비스 이용을 위해 로그인이 필요합니다.',
        onConfirm: onKakaoLoginClick
      });
    } else if (role === 'owner') {
      if (storeName) {
        navigate(`/${storeName}`);
      } else {
        showAlert({
          type: 'info',
          message: '스토어 정보를 불러오는 중입니다. 잠시만 기다려주세요.'
        });
        refreshProfile();
      }
    } else {
      setIsBecomeOwnerModalOpen(true);
    }
  };

  return (
    <div className="landing-wrapper">
      <Header onKakaoLoginClick={onKakaoLoginClick} />

      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="container">
          <div className="badge">
            <Zap size={14} fill="currentColor" /> 복잡한 설정 없이 바로 시작하는 무료 예약
          </div>
          <h1 className="main-title">
            가장 쉽고 빠른<br />
            <span>무료 예약 솔루션</span>
          </h1>
          <p className="sub-description">
            어려운 기능은 덜어내고 본질만 담았습니다.<br className="pc-only" />
            사장님을 위한 전용 스토어와 예약 관리를<br className="pc-only" />
            지금 바로 무료로 시작하세요.
          </p>
          
          <div className="hero-button-group">
            <button 
              className="primary-btn" 
              onClick={handleBecomeOwnerClick}
              disabled={isOwnerButtonDisabled}
            >
              {getOwnerButtonContent()} <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 핵심 가치 섹션 - 레이아웃 교정됨 */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              복잡함은 빼고, <br className="mo-only" />
              <span>핵심만 담았습니다</span>
            </h2>
            <p className="section-subtitle">
              누구나 <strong>1분이면</strong> 나만의 예약 페이지를 가질 수 있습니다.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper"><Layout size={32} color="#2b59ff" /></div>
              <div className="feature-text">
                <h3>즉시 생성되는 스토어</h3>
                <p>사장님 전용 주소를 부여받아<br />SNS 프로필에 바로 연결하세요.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper"><Calendar size={32} color="#2b59ff" /></div>
              <div className="feature-text">
                <h3>간편한 예약 확인</h3>
                <p>복잡한 관리 화면 대신<br />직관적인 리스트로 예약을 관리하세요.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper"><ImageIcon size={32} color="#2b59ff" /></div>
              <div className="feature-text">
                <h3>빠른 결과물 공유</h3>
                <p>자동 최적화된 이미지로<br />사장님의 포트폴리오를 홍보하세요.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper"><Smartphone size={32} color="#2b59ff" /></div>
              <div className="feature-text">
                <h3>모바일 최적화</h3>
                <p>PC와 모바일 어디서든<br />끊김 없는 사용자 경험을 제공합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 강점 섹션 */}
      <section className="strengths-section">
        <div className="container">
          <div className="strengths-layout">
            <div className="strengths-text">
              <h2 className="section-title">오직 사장님만을 위해</h2>
              <ul className="strengths-list">
                <li>
                  <div className="check-icon"><CheckCircle size={24} color="#2b59ff" /></div>
                  <div>
                    <strong>예약 완전 무료 & 무제한</strong>
                    <p>월 이용료나 수수료 부담 없이<br />자유롭게 이용하세요.</p>
                  </div>
                </li>
                <li>
                  <div className="check-icon"><CheckCircle size={24} color="#2b59ff" /></div>
                  <div>
                    <strong>압도적인 간결함</strong>
                    <p>별도의 매뉴얼이 필요 없을 만큼<br />단순하고 명확한 화면을 구성했습니다.</p>
                  </div>
                </li>
                <li>
                  <div className="check-icon"><PlusCircle size={24} color="#2b59ff" /></div>
                  <div>
                    <strong>진화하는 플랫폼</strong>
                    <p>
                      사장님들의 의견을 반영한 편리한 기능들을<br className="pc-only" /> 
                      지속적으로 업데이트할 예정입니다.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="strengths-visual">
              <div className="mockup-ui">
                <div className="mockup-header">
                  <div className="mockup-dot"></div>
                  <div className="mockup-address">nlaps.com/my-store</div>
                </div>
                <div className="mockup-body">
                  <div className="mockup-profile">
                    <div className="mockup-avatar"></div>
                    <div className="mockup-info">
                      <div className="mockup-line title">앤랩스 스토어</div>
                      <div className="mockup-line sub">예약 가능한 시간 확인하기</div>
                    </div>
                  </div>
                  <div className="mockup-item">
                    <div className="mockup-label">오늘의 예약</div>
                    <div className="mockup-content">오후 2:00 - 김철수님</div>
                  </div>
                  <div className="mockup-item highlight">
                    <div className="mockup-label">포트폴리오</div>
                    <div className="mockup-image-grid">
                      <div className="img"></div>
                      <div className="img"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR 코드 섹션 */}
      <section className="qr-section">
        <div className="container">
          <div className="qr-layout">
            <div className="qr-visual">
              <div className="qr-decor"></div>
              <div className="qr-mockup">
                <div className="qr-placeholder">
                  <QrCode size={120} color="#2b59ff" strokeWidth={1.5} />
                </div>
                <div className="qr-label">나만의 스토어 QR</div>
              </div>
            </div>
            <div className="qr-text">
              <h2 className="section-title"><span>QR 코드로 연결하세요</span></h2>
              <div className="qr-benefits">
                <div className="benefit-item">
                  <div className="benefit-dot"></div>
                  <p><strong>매장 비치</strong>: 카운터나 입구에 QR 코드를 비치하여 고객이 즉시 예약하거나 포트폴리오를 확인하게 하세요.</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-dot"></div>
                  <p><strong>간편 다운로드</strong>: 생성된 QR 코드를 이미지로 다운로드하여 명함, 배너, 스티커 등에 바로 활용할 수 있습니다.</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-dot"></div>
                  <p><strong>실시간 연결</strong>: 별도의 앱 설치 없이 휴대폰 카메라만으로 사장님의 스토어에 즉시 접속됩니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="cta-section">
        <div className="container">
          <h2>지금 바로 무료로 시작하세요</h2>
          <p>카카오 로그인 한 번으로 사장님의 전용 페이지가 완성됩니다.</p>
          <button className="cta-btn" onClick={handleBecomeOwnerClick}>무료 사장님 등록하기</button>
          <p className="future-notice">* 알림톡, 통계확인 등 다양한 편의 기능이 곧 추가됩니다.</p>
        </div>
      </section>

      <Footer />

      <BecomeOwnerModal 
        isOpen={isBecomeOwnerModalOpen} 
        onClose={() => setIsBecomeOwnerModalOpen(false)}
        onSuccess={refreshProfile}
      />

      <ContactButton onClick={() => setIsContactModalOpen(true)} />
      
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default LandingPage;