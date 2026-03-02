import React, { useState } from 'react';
import './KakaoLoginModal.css'; 
import { useUserSession } from '../hooks/useUserSession';
import { useImageHandler } from '../hooks/useImageHandler';

interface BecomeOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BecomeOwnerModal: React.FC<BecomeOwnerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useUserSession();
  const [file, setFile] = useState<File | null>(null);
  const [storeName, setStoreName] = useState(''); // [추가] 상점 주소 상태
  const { isUploading: uploading, uploadLicense } = useImageHandler();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    // 1. 유효성 검사: 상점 주소 입력 여부
    if (!storeName.trim()) {
      alert("원하시는 상점 주소를 입력해주세요.");
      return;
    }

    // 2. 유효성 검사: 상점 주소 형식 (영문 소문자, 숫자, 하이픈만 허용)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(storeName)) {
      alert("상점 주소는 영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다.");
      return;
    }

    // 3. 유효성 검사: 사업자 등록증 파일
    if (!file) {
      alert("사업자 등록증 이미지를 반드시 첨부해주세요.");
      return;
    }

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    const userNickname = user.user_metadata.full_name || user.user_metadata.nickname || 'unknown';

    try {
      await uploadLicense(user.id, storeName, file, userNickname);
      alert(`${userNickname} 사장님, 신청 서류가 성공적으로 제출되었습니다!`);
      if (onSuccess) onSuccess(); 
      onClose();
    } catch (error: any) {
      alert("오류가 발생했습니다: " + error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="x-button" onClick={onClose}>&times;</button>
        <h2>사장님으로 등록하기</h2>
        <p>서비스 이용을 위해 사업자 등록증 확인이 필요합니다.</p>

        {/* [추가] 상점 주소 입력 섹션 */}
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            희망 상점 주소 (URL)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>myapp.com/</span>
            <input 
              type="text" 
              placeholder="my-cool-shop"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value.toLowerCase())} // 소문자 강제 변환
              style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>
            * 영문 소문자, 숫자, 하이픈(-)만 입력 가능합니다.
          </small>
        </div>

        {/* 사업자 등록증 첨부 섹션 */}
        <div style={{ margin: '1.5rem 0', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            사업자 등록증 첨부 (이미지)
          </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          className="kakao-button" 
          onClick={handleUpgrade} 
          disabled={uploading}
          style={{ backgroundColor: uploading ? '#ccc' : '#FEE500' }}
        >
          {uploading ? '제출 중...' : '신청 서류 제출하기'}
        </button>
      </div>
    </div>
  );
};

export default BecomeOwnerModal;