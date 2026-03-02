import React, { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUserSession } from '../hooks/useUserSession';
import { useImageHandler } from '../hooks/useImageHandler';
import { supabase } from '../supabaseClient';
import './Home.css';

interface StoreContext {
  storeName: string;
  ownerId: string;
}

const Home: React.FC = () => {
  const { ownerId } = useOutletContext<StoreContext>();
  const { user } = useUserSession();
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, uploadBanner, deleteBanner, getFullUrl } = useImageHandler();
  
  // 오직 해당 스토어의 오너(Owner)인 경우에만 편집 권한 부여
  const isOwner = user?.id === ownerId;

  // 배너 정보 가져오기
  const fetchBanner = async () => {
    if (!ownerId) return;
    try {
      const { data, error } = await supabase
        .from('public_store_info')
        .select('banner_url')
        .eq('id', ownerId)
        .maybeSingle();
      
      if (error) {
        console.error('Supabase 조회 에러:', error);
        return;
      }

      if (data && data.banner_url) {
        const fullUrl = `${getFullUrl(data.banner_url)}?t=${Date.now()}`;
        setBannerUrl(fullUrl);
      } else {
        setBannerUrl(null);
      }
    } catch (err) {
      console.error('배너 로딩 중 예외 발생:', err);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [ownerId]);

  // 배너 업로드 처리
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!window.confirm("배너 이미지를 변경하시겠습니까?")) return;

    try {
      await uploadBanner(user.id, file);
      alert("배너가 성공적으로 변경되었습니다.");
      fetchBanner();
    } catch (error: any) {
      alert(`배너 업로드 실패: ${error.message}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 배너 삭제 처리
  const handleBannerDelete = async () => {
    if (!window.confirm("배너를 삭제하고 기본 이미지로 변경하시겠습니까?")) return;
    if (!user) return;

    try {
      await deleteBanner(user.id);
      alert("배너가 삭제되었습니다.");
      setBannerUrl(null);
    } catch (error: any) {
      alert(`배너 삭제 실패: ${error.message}`);
    }
  };

  return (
    <div className="home">
      <div 
        className="main-banner" 
        style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none' }}
      >
        {!bannerUrl && !isUploading && (
          <div className="banner-placeholder">
            <span>📷</span>
            <p>배너 이미지를 등록해 주세요</p>
          </div>
        )}
        
        {isUploading && (
          <div className="banner-content">
            <div className="uploading-text">이미지 업로드 중...</div>
          </div>
        )}

        {isOwner && (
          <div className="banner-edit-controls">
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              ref={fileInputRef}
              onChange={handleBannerUpload}
            />
            <button 
              className="edit-banner-btn" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              📷 {bannerUrl ? '배너 수정' : '배너 등록'}
            </button>
            {bannerUrl && (
              <button 
                className="delete-banner-btn" 
                onClick={handleBannerDelete}
                disabled={isUploading}
              >
                ✕ 배너 삭제
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
