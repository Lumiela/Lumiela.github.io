import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUserSession } from '../hooks/useUserSession';
import { useImageHandler } from '../hooks/useImageHandler';
import Card from './Card';
import './Portfolio.css';

interface PortfolioItem {
  id: string | number;
  title: string;
  description: string;
  image_url: string;
}

interface StoreContext {
  storeName: string;
  ownerId: string;
}

const Portfolio: React.FC = () => {
  const { ownerId } = useOutletContext<StoreContext>();
  const { user } = useUserSession();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 등록 폼 관련 상태
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { isUploading, uploadPortfolio, deletePortfolio, getFullUrl, MAX_POSTS } = useImageHandler();
  const isOwner = user?.id === ownerId;

  // [추가] 업로드 가능 여부 계산
  const canUpload = items.length < MAX_POSTS;

  const fetchPortfolio = async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_posts')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        const formattedData = data.map(item => ({
          ...item,
          displayImageUrl: getFullUrl(item.image_url)
        }));
        setItems(formattedData);
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [ownerId]);

  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file || !title) return alert("이미지와 제목을 입력해주세요.");

    // [P0] 프론트엔드 길이 검증
    if (title.length > 50) return alert("제목은 50자 이내여야 합니다.");
    if (description.length > 500) return alert("설명은 500자 이내여야 합니다.");

    try {
      await uploadPortfolio(user.id, title, description, file);
      alert("등록되었습니다.");
      setTitle('');
      setDescription('');
      setFile(null);
      setShowUploadForm(false);
      fetchPortfolio(); // 목록 새로고침
    } catch (error: any) {
      alert(error.message); // useImageHandler에서 던지는 에러 메시지(개수 초과 등)를 그대로 표시
    }
  };

  const handleDelete = async (postId: string | number) => {
    if (!window.confirm("정말로 이 작품을 삭제하시겠습니까?\n서버 파일과 DB에서 모두 영구 삭제됩니다.")) return;
    if (!user) return;

    try {
      await deletePortfolio(postId.toString(), user.id);
      alert("성공적으로 삭제되었습니다.");
      fetchPortfolio(); // 목록 새로고침
    } catch (error: any) {
      alert(`삭제 실패: ${error.message}`);
    }
  };

  if (loading && items.length === 0) return <div className="loading-text">포트폴리오 로딩 중...</div>;

  return (
    <div className="portfolio content-wrapper">
      <div className="page-header">
        <div className="header-title-group">
          <h1 className="page-title">
            포트폴리오
            {/* [추가] 실시간 개수 표시 */}
            <span className={`post-count ${!canUpload ? 'limit' : ''}`}>
              ({items.length} / {MAX_POSTS})
            </span>
          </h1>
        </div>
        
        {isOwner && (
          <button 
            className={`add-portfolio-toggle-btn ${showUploadForm ? 'active' : ''}`}
            onClick={() => {
              // [추가] 10개 도달 시 폼 열기 차단 및 안내
              if (!canUpload && !showUploadForm) {
                alert(`최대 ${MAX_POSTS}개까지만 등록 가능합니다. 새로운 작품을 등록하려면 기존 작품을 삭제해 주세요.`);
                return;
              }
              setShowUploadForm(!showUploadForm);
            }}
          >
            {showUploadForm ? '취소' : '+ 새 작품 등록'}
          </button>
        )}
      </div>

      {/* [추가] 한도 도달 시 경고 배너 */}
      {!canUpload && isOwner && !showUploadForm && (
        <div className="limit-warning-banner">
          ⚠️ 포트폴리오 등록 한도(10개)에 도달했습니다.
        </div>
      )}

      {showUploadForm && (
        <div className="portfolio-upload-section">
          <form onSubmit={handlePortfolioSubmit} className="portfolio-modern-form">
            <div className="form-title-row">
              <h3>새 작품 등록하기</h3>
              <p>오너님의 멋진 작품을 공유해 보세요!</p>
            </div>
            
            <div className="form-group file-input-group">
              <label htmlFor="file-upload" className="custom-file-upload">
                {file ? `✅ ${file.name}` : '📸 작품 이미지 선택 (필수)'}
              </label>
              <input 
                id="file-upload"
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
            </div>

            <div className="form-group">
              <input 
                type="text" 
                placeholder="제목을 입력하세요 (필수, 최대 50자)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="modern-input"
                maxLength={50}
                required
              />
              <div className="char-count">{title.length} / 50</div>
            </div>

            <div className="form-group">
              <textarea 
                placeholder="작품에 대한 간단한 설명을 남겨주세요 (선택, 최대 500자)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="modern-textarea"
                maxLength={500}
              />
              <div className="char-count">{description.length} / 500</div>
            </div>

            <button 
              type="submit" 
              disabled={isUploading || !canUpload} 
              className="modern-submit-btn"
            >
              {isUploading ? '📤 작품 업로드 중...' : '등록 완료'}
            </button>
          </form>
        </div>
      )}
      
      <div className="portfolio-grid">
        {items.length === 0 ? (
          <div className="empty-portfolio">
            <p>아직 등록된 작품이 없습니다.</p>
            {isOwner && <p className="hint">상단의 '+ 새 작품 등록' 버튼을 눌러 작품을 추가해 보세요!</p>}
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="portfolio-card-wrapper">
              {isOwner && (
                <button 
                  className="card-delete-btn"
                  onClick={() => handleDelete(item.id)}
                  title="작품 삭제"
                >
                  ✕
                </button>
              )}
              <Card
                title={item.title}
                description={item.description}
                imageUrl={(item as any).displayImageUrl}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Portfolio;