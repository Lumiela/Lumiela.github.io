import React, { useRef } from 'react';
import './QRCodeModal.css';
import { QRCodeCanvas } from 'qrcode.react';
import { useAlert } from '../hooks/useAlert';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  storeName: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, storeName }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const { showAlert } = useAlert();
  const storeUrl = `${window.location.origin}/${storeName}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    showAlert({
      type: 'success',
      title: '복사 완료',
      message: '스토어 주소가 클립보드에 복사되었습니다.'
    });
  };

  const handleDownloadQr = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = `store_qr_${storeName}.png`;
      link.href = url;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>×</button>
        <h2>내 스토어 QR 코드</h2>
        <p>고객에게 보여주거나 링크를 공유하세요.</p>
        
        <div className="qr-image-container" ref={qrRef}>
          <QRCodeCanvas
            value={storeUrl}
            size={256}
            level={"H"}
            includeMargin={true}
          />
        </div>

        <div className="qr-actions">
          <div className="link-copy-section">
            <input type="text" value={storeUrl} readOnly />
            <button className="copy-btn" onClick={handleCopyLink}>복사</button>
          </div>
          <button className="download-btn" onClick={handleDownloadQr}>이미지 다운로드</button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
