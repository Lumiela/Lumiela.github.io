import React, { ReactNode, useEffect } from 'react';
import './BaseModal.css';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = '450px',
  showCloseButton = true 
}) => {
  // ESC 키로 닫기 기능
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="base-modal-overlay" onClick={onClose}>
      <div 
        className="base-modal-content" 
        style={{ maxWidth }} 
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button className="base-modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        )}
        
        {title && <h2 className="base-modal-title">{title}</h2>}
        
        <div className="base-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
