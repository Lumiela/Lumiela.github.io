import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-20d7cd89ed4142d28028c7e07cc15979.r2.dev'; // R2 퍼블릭 도메인
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const WEBP_QUALITY = 0.8; // WebP 압축 품질 (0.0 ~ 1.0)
const MAX_POSTS = 10; // [추가] 최대 등록 가능 개수

export const useImageHandler = () => {
  const [isUploading, setIsUploading] = useState(false);

  // 인증 헤더 생성 공통 함수
  const getAuthHeaders = useCallback(async (isMultipart = false) => {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${session?.access_token}`,
    };
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }, []);

  // 이미지 압축 함수 (WebP 변환)
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context not available'));
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Image compression failed'));
            },
            'image/webp',
            WEBP_QUALITY
          );
        };
        img.onerror = () => reject(new Error('Image loading failed'));
      };
      reader.onerror = () => reject(new Error('File reading failed'));
    });
  };

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
    }
  };

  const getFullUrl = useCallback((path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // [수정] 워커를 거치지 않고 R2 CDN 주소로 직접 연결하여 로딩 속도 극대화
    return `${R2_PUBLIC_URL}/${path}`;
  }, []);

  const uploadLicense = async (userId: string, storeName: string, file: File, userNickname: string) => {
    validateFile(file);
    setIsUploading(true);
    try {
      const compressedBlob = await compressImage(file);
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('realName', userNickname);
      formData.append('license', compressedBlob, `license_${Date.now()}.webp`);
      formData.append('storeName', storeName);
      
      const headers = await getAuthHeaders(true);
      const response = await fetch(`${BACKEND_URL}/api/upload-license`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || '서버 업로드에 실패했습니다.');
      }
      return result;
    } finally {
      setIsUploading(false);
    }
  };

  // [수정] 업로드 전 동기적 개수 체크 로직 추가
  const uploadPortfolio = async (userId: string, title: string, description: string, file: File) => {
    validateFile(file);
    setIsUploading(true);
    try {
      // 1. DB에서 현재 사용자의 포트폴리오 개수 확인
      const { count, error: countError } = await supabase
        .from('portfolio_posts')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId);

      if (countError) throw new Error('데이터 확인 중 오류가 발생했습니다.');
      if (count !== null && count >= MAX_POSTS) {
        throw new Error(`최대 ${MAX_POSTS}개까지만 등록 가능합니다. 기존 작품을 삭제해 주세요.`);
      }

      // 2. 기존 업로드 로직 진행
      const compressedBlob = await compressImage(file);
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', compressedBlob, `portfolio_${Date.now()}.webp`);
      
      const headers = await getAuthHeaders(true);
      const response = await fetch(`${BACKEND_URL}/api/portfolio/upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || '업로드 실패');
      return result;
    } finally {
      setIsUploading(false);
    }
  };

  const deletePortfolio = async (postId: string, userId: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BACKEND_URL}/api/portfolio/delete/${postId}?userId=${userId}`, {
      method: 'DELETE',
      headers: headers,
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || '삭제 실패');
    return result;
  };

  const uploadBanner = async (userId: string, file: File) => {
    validateFile(file);
    setIsUploading(true);
    try {
      const compressedBlob = await compressImage(file);
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('banner', compressedBlob, `banner_${Date.now()}.webp`);
      
      const headers = await getAuthHeaders(true);
      const response = await fetch(`${BACKEND_URL}/api/banner/upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || '배너 업로드 실패');
      return result;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteBanner = async (userId: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BACKEND_URL}/api/banner/delete?userId=${userId}`, {
      method: 'DELETE',
      headers: headers,
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || '배너 삭제 실패');
    return result;
  };

  const downloadImage = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    isUploading,
    getFullUrl,
    uploadLicense,
    uploadPortfolio,
    deletePortfolio,
    uploadBanner,
    deleteBanner,
    downloadImage,
    BACKEND_URL,
    MAX_POSTS, // [추가] UI 활용을 위해 상수를 내보냄
  };
};