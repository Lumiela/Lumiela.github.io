import React from 'react';
import BaseModal from './BaseModal';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import './AlertModal.css';

export type AlertType = 'success' | 'error' | 'info';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: AlertType;
  title?: string;
  message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({ 
  isOpen, 
  onClose, 
  type = 'info', 
  title, 
  message 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={52} color="#10b981" strokeWidth={1.5} />;
      case 'error': return <AlertCircle size={52} color="#ef4444" strokeWidth={1.5} />;
      default: return <Info size={52} color="#2b59ff" strokeWidth={1.5} />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'success': return 'alert-btn-success';
      case 'error': return 'alert-btn-error';
      default: return 'alert-btn-primary';
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="alert-content">
        <div className="alert-icon-wrapper">
          {getIcon()}
        </div>
        
        {title && <h3 className="alert-title">{title}</h3>}
        <p className="alert-message">{message}</p>
        
        <button className={`alert-confirm-btn ${getButtonClass()}`} onClick={onClose}>
          확인
        </button>
      </div>
    </BaseModal>
  );
};

export default AlertModal;
