import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUserSession } from '../hooks/useUserSession';
import './Footer.css';

interface StoreInfo {
  trade_name: string;
  address: string;
  representative_name: string;
  business_number: string;
  phone: string;
  email: string;
}

interface FooterProps {
  ownerId?: string | null;
  transparent?: boolean;
}

const Footer: React.FC<FooterProps> = ({ ownerId: propOwnerId, transparent = false }) => {
  const { storeName: urlStoreName } = useParams<{ storeName: string }>();
  const { user } = useUserSession();
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    trade_name: '',
    address: '',
    representative_name: '',
    business_number: '',
    phone: '',
    email: '',
  });
  const [internalOwnerId, setInternalOwnerId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<StoreInfo>(storeInfo);
  const [loading, setLoading] = useState(false);

  const ownerId = propOwnerId || internalOwnerId;

  useEffect(() => {
    const fetchStoreInfo = async () => {
      // urlStoreName이 없으면 기본 플랫폼 정보를 설정하고 종료
      if (!urlStoreName) {
        setStoreInfo({
          trade_name: '앤랩스 (N LABS)',
          address: ' 광주광역시 동구 백서로125번길 34-2, 5층 - 제이 73호(금동)',
          representative_name: '나익준',
          business_number: '191-10-03054',
          phone: '010-9887-8382',
          email: 'ssler1@naver.com',
        });
        return;
      }
      
      try {
        const { data: storeData, error: storeError } = await supabase
          .from('public_store_info')
          .select('id, trade_name, address, representative_name, business_number, phone, email, store_name')
          .eq('store_name', decodeURIComponent(urlStoreName))
          .maybeSingle();

        if (storeError) {
          console.warn('푸터 정보 조회 에러:', storeError.message);
          return;
        }

        if (storeData) {
          setInternalOwnerId(storeData.id);
          const info: StoreInfo = {
            trade_name: storeData.trade_name || storeData.store_name || '',
            address: storeData.address || '',
            representative_name: storeData.representative_name || '',
            business_number: storeData.business_number || '',
            phone: storeData.phone || '',
            email: storeData.email || '',
          };
          setStoreInfo(info);
          setEditData(info);
        }
      } catch (err) {
        console.error('Error fetching store info for footer:', err);
      }
    };
    fetchStoreInfo();
  }, [urlStoreName]);

  const isOwner = user?.id === ownerId;
  const isInfoEmpty = !storeInfo.trade_name && !storeInfo.address && !storeInfo.phone;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isOwner) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          trade_name: editData.trade_name,
          address: editData.address,
          representative_name: editData.representative_name,
          business_number: editData.business_number,
          phone: editData.phone,
          email: editData.email,
        })
        .eq('id', user.id);

      if (error) throw error;
      setStoreInfo(editData);
      setIsEditing(false);
      alert('정보가 저장되었습니다.');
    } catch (err: any) {
      alert('저장 실패: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className={`footer ${transparent ? 'transparent' : ''}`}>
      <div className="footer-container">
        {/* 수정 버튼: 독립적 위치 (절대 위치) */}
        {isOwner && !isEditing && (
          <button className="footer-edit-floating-btn" onClick={() => setIsEditing(true)}>
            {isInfoEmpty ? '정보 입력' : '정보 수정'}
          </button>
        )}

        {/* 좌측: 로고 및 카피라이트 */}
        <div className="footer-left">
          <div className="footer-logo">N LABS</div>
          <p className="copyright">Copyright © {storeInfo.trade_name || '앤랩스'}.<br/>All Rights Reserved.</p>
        </div>

        {/* 우측: 상세 정보 */}
        <div className="footer-right">
          {isEditing ? (
            <form className="footer-edit-form" onSubmit={handleUpdate}>
              <div className="edit-grid">
                <input placeholder="상호명" value={editData.trade_name} onChange={e => setEditData({...editData, trade_name: e.target.value})} />
                <input placeholder="대표자" value={editData.representative_name} onChange={e => setEditData({...editData, representative_name: e.target.value})} />
                <input placeholder="사업자번호" value={editData.business_number} onChange={e => setEditData({...editData, business_number: e.target.value})} />
                <input placeholder="TEL" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} />
                <input placeholder="E-mail" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} />
                <input placeholder="주소" value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} className="full-width-input" />
              </div>
              <div className="edit-actions">
                <button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</button>
                <button type="button" onClick={() => { setIsEditing(false); setEditData(storeInfo); }}>취소</button>
              </div>
            </form>
          ) : (
            <div className="footer-info-container">
              <div className="footer-info-list">
                <div className="info-item"><span className="label">상호명</span><span className="value">{storeInfo.trade_name}</span></div>
                <div className="info-item"><span className="label">대표자</span><span className="value">{storeInfo.representative_name}</span></div>
                <div className="info-item"><span className="label">사업자번호</span><span className="value">{storeInfo.business_number}</span></div>
                <div className="info-item"><span className="label">TEL</span><span className="value">{storeInfo.phone}</span></div>
                <div className="info-item"><span className="label">E-mail</span><span className="value">{storeInfo.email}</span></div>
              </div>
              <div className="footer-bottom-row">
                <div className="info-item address-item">
                  <span className="label">주소</span>
                  <span className="value">{storeInfo.address}</span>
                  {storeInfo.address && (
                    <a href={`https://map.kakao.com/?q=${encodeURIComponent(storeInfo.address)}`} target="_blank" rel="noopener noreferrer" className="map-link-btn">지도</a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;