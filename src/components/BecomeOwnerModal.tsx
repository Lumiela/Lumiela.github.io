import React, { useState } from 'react';
import BaseModal from './BaseModal';
import './BecomeOwnerModal.css';
import { useUserSession } from '../hooks/useUserSession';
import { useImageHandler } from '../hooks/useImageHandler';
import { useAlert } from '../hooks/useAlert';
import { Upload, Link as LinkIcon, FileText, Check } from 'lucide-react';

interface BecomeOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BecomeOwnerModal: React.FC<BecomeOwnerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useUserSession();
  const { showAlert } = useAlert();
  const [file, setFile] = useState<File | null>(null);
  const [storeName, setStoreName] = useState('');
  const { isUploading: uploading, uploadLicense } = useImageHandler();

  const handleUpgrade = async () => {
    if (!storeName.trim()) {
      showAlert({
        type: 'error',
        message: "원하시는 상점 주소를 입력해주세요."
      });
      return;
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(storeName)) {
      showAlert({
        type: 'error',
        message: "상점 주소는 영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다."
      });
      return;
    }

    if (!file) {
      showAlert({
        type: 'error',
        message: "사업자 등록증 이미지를 반드시 첨부해주세요."
      });
      return;
    }

    if (!user) {
      showAlert({
        type: 'error',
        message: "로그인이 필요합니다."
      });
      return;
    }
    
    const userNickname = user.user_metadata.full_name || user.user_metadata.nickname || 'unknown';

    try {
      await uploadLicense(user.id, storeName, file, userNickname);
      showAlert({
        type: 'success',
        title: '신청 완료',
        message: `${userNickname} 사장님, 신청 서류가 성공적으로 제출되었습니다!`,
        onConfirm: () => {
          if (onSuccess) onSuccess(); 
          onClose();
        }
      });
    } catch (error: any) {
      showAlert({
        type: 'error',
        title: '오류 발생',
        message: "제출 중 오류가 발생했습니다: " + error.message
      });
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="사장님으로 등록하기"
      maxWidth="480px"
    >
      <div className="become-owner-container">
        <div className="become-owner-header">
          <p>서비스 이용을 위해 상점 정보와<br />사업자 등록증 확인이 필요합니다.</p>
        </div>

        <div className="input-group">
          <label className="input-label">
            <LinkIcon size={16} /> 희망 상점 주소 (URL)
          </label>
          <div className="url-input-wrapper">
            <span className="url-prefix">nlaps.com/</span>
            <input 
              type="text" 
              className="url-input"
              placeholder="my-store-name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value.toLowerCase())}
            />
          </div>
          <p className="input-hint">* 영문 소문자, 숫자, 하이픈(-)만 사용 가능</p>
        </div>

        <div className="input-group">
          <label className="input-label">
            <FileText size={16} /> 사업자 등록증 첨부 (이미지)
          </label>
          <div className="file-input-wrapper">
            <input 
              type="file" 
              id="license-file"
              accept="image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
            <label htmlFor="license-file" className="file-input-custom">
              {file ? (
                <span style={{ color: 'var(--primary-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={18} /> {file.name}
                </span>
              ) : (
                '파일 선택하기 (JPG, PNG, WEBP)'
              )}
            </label>
          </div>
        </div>

        <button 
          className="submit-btn" 
          onClick={handleUpgrade} 
          disabled={uploading}
        >
          {uploading ? (
            <>제출 중...</>
          ) : (
            <>
              <Upload size={20} /> 신청 서류 제출하기
            </>
          )}
        </button>
      </div>
    </BaseModal>
  );
};

export default BecomeOwnerModal;
