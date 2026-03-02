import React from 'react';
import './ContactModal.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="contact-modal-close" onClick={onClose}>&times;</button>
        <div className="contact-modal-header">
          <h2>문의하기</h2>
        </div>
        <div className="contact-modal-body">
          <p className="contact-info-text">
            비즈니스 제휴 및 문의사항은 아래 이메일로 연락 부탁드립니다.
          </p>
          <div className="email-box">
            <a href="mailto:ssler1@naver.com" className="email-link">
              ssler1@naver.com
            </a>
          </div>
        </div>
        <div className="contact-modal-footer">
          <button className="confirm-button" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
