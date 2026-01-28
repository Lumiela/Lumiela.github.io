import React, { useEffect, useState, forwardRef, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '../../supabaseClient';
import { createImageHandler, getEditorModules } from '../../hooks/editorHandlers';

const NoticeSection = forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [user, setUser] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const quillRef = useRef(null);

  const BUCKET_NAME = 'daonrs'; // 버킷 이름 통일

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    setPosts(data?.map(item => ({ ...item, date: item.created_at?.split('T')[0] })) || []);
  };

  // ✅ 이미지 핸들러: 'notices' 폴더에 저장하며, editorHandlers에서 구현한 WebP 압축 적용
  const handler = useMemo(() => createImageHandler(quillRef, 'notices'), []);
  const modules = useMemo(() => getEditorModules(handler), [handler]);

  const handleSave = async () => {
    if (!title || !content) return alert('제목과 내용을 입력하세요.');
    
    const postData = { title, content };

    try {
      if (isEditing) {
        const { error } = await supabase.from('notices').update(postData).eq('id', editingId);
        if (error) throw error;
        alert('수정되었습니다.');
      } else {
        const { error } = await supabase.from('notices').insert([postData]);
        if (error) throw error;
        alert('등록되었습니다.');
      }
      cancelWriting();
      fetchNotices();
    } catch (err) {
      alert('저장 중 오류가 발생했습니다: ' + err.message);
    }
  };

  // ✅ 삭제 로직: 본문에 포함된 이미지 추출 및 Storage 삭제 시도
  const handleDelete = async (e, post) => {
    e.stopPropagation();
    if (!window.confirm('정말 삭제하시겠습니까? 본문에 포함된 이미지도 함께 삭제됩니다.')) return;

    try {
      // 1. 본문(HTML)에서 이미지 URL들 추출
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      let match;
      const imageUrls = [];
      while ((match = imgRegex.exec(post.content)) !== null) {
        imageUrls.push(match[1]);
      }

      // 2. Storage에서 이미지 파일들 삭제
      if (imageUrls.length > 0) {
        const filePaths = imageUrls
          .filter(url => url.includes(BUCKET_NAME)) // 우리 버킷 파일만 필터링
          .map(url => {
            const parts = url.split(`${BUCKET_NAME}/`);
            return parts[parts.length - 1];
          });

        if (filePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove(filePaths);
          
          if (storageError) console.error('Storage 이미지 삭제 중 일부 실패:', storageError);
        }
      }

      // 3. DB 레코드 삭제
      const { error: dbError } = await supabase.from('notices').delete().eq('id', post.id);
      if (dbError) throw dbError;

      alert('삭제되었습니다.');
      fetchNotices();
    } catch (err) {
      alert('삭제 처리 중 오류가 발생했습니다: ' + err.message);
    }
  };

  const startEditing = (e, post) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setIsWriting(true);
    setExpandedId(null);
  };

  const cancelWriting = () => {
    setIsWriting(false);
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <section id="notice" ref={ref} className="support-content-section section">
      <div className="sub-section">
        <header className="support-subsection-header">
          <h2>공지사항</h2>
          {user && !isWriting && <button onClick={() => setIsWriting(true)} className="notice-write-button">글쓰기</button>}
        </header>
        <hr className="section-top-line" />
        {isWriting ? (
          <div className="cafe-editor-container">
            <input type="text" className="editor-title-input" placeholder="공지 제목" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <div className="quill-wrapper">
              <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} placeholder="본문에 이미지를 넣으면 자동으로 WebP로 압축되어 최적화됩니다." />
            </div>
            <div className="editor-footer">
              <button className="btn-cancel" onClick={cancelWriting}>취소</button>
              <button className="btn-submit" onClick={handleSave}>{isEditing ? '수정완료' : '등록'}</button>
            </div>
          </div>
        ) : (
          <div className="notice-list">
            {posts.map((post) => (
              <div key={post.id} className="list-item-wrapper">
                <div onClick={() => setExpandedId(expandedId === post.id ? null : post.id)} className={`list-item-header ${expandedId === post.id ? 'expanded' : ''}`}>
                  <div className="list-item-title-group"><div className="q-icon-circle">Q</div><span className={`item-title ${expandedId === post.id ? 'expanded' : ''}`}>{post.title}</span></div>
                  <div className="item-meta">
                    {user && (
                      <div className="notice-item-actions">
                        <span onClick={(e) => startEditing(e, post)} className="notice-action-edit">수정</span>
                        {/* ✅ handleDelete에 post 객체 전체 전달 */}
                        <span onClick={(e) => handleDelete(e, post)} className="notice-action-delete">삭제</span>
                      </div>
                    )}
                    <span>{post.date}</span>
                    <span className={`dataroom-accordion-icon ${expandedId === post.id ? 'expanded' : ''}`}>▼</span>
                  </div>
                </div>
                {expandedId === post.id && (
                  <div className="item-content">
                    <div className="post-text-body ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default NoticeSection;