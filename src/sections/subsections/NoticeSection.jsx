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

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const quillRef = useRef(null);
  const BUCKET_NAME = 'daonrs';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
  }, []);

  // 페이지 변경 시 데이터 호출
  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const fetchNotices = async () => {
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, count, error } = await supabase
      .from('notices')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (!error) {
      setPosts(data?.map(item => ({ ...item, date: item.created_at?.split('T')[0] })) || []);
      setTotalCount(count || 0);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (ref && ref.current) {
      window.scrollTo({ top: ref.current.offsetTop - 100, behavior: 'smooth' });
    }
  };

  const handler = useMemo(() => createImageHandler(quillRef, 'notices'), []);
  const modules = useMemo(() => getEditorModules(handler), [handler]);

  const handleSave = async () => {
    if (!title || !content) return alert('제목과 내용을 입력하세요.');
    const postData = { title, content };
    try {
      if (isEditing) {
        await supabase.from('notices').update(postData).eq('id', editingId);
        alert('수정되었습니다.');
      } else {
        await supabase.from('notices').insert([postData]);
        alert('등록되었습니다.');
        setCurrentPage(1); 
      }
      cancelWriting();
      fetchNotices();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (e, post) => {
    e.stopPropagation();
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await supabase.from('notices').delete().eq('id', post.id);
      alert('삭제되었습니다.');
      fetchNotices();
    } catch (err) { alert(err.message); }
  };

  const startEditing = (e, post) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setIsWriting(true);
  };

  const cancelWriting = () => {
    setIsWriting(false); setIsEditing(false); setEditingId(null);
    setTitle(''); setContent('');
  };

  return (
    <section id="notice" ref={ref} className="section">
      <div className="sub-section">
        <header className="subsection-header">
          <h2 className="subsection-title">공지사항</h2>
          {user && !isWriting && <button onClick={() => setIsWriting(true)} className="notice-write-button">글쓰기</button>}
        </header>
        <hr className="section-top-line" />

        {isWriting ? (
          <div className="cafe-editor-container">
            <input type="text" className="editor-title-input" placeholder="공지 제목" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <div className="quill-wrapper">
              <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} />
            </div>
            <div className="editor-footer">
              <button className="btn-cancel" onClick={cancelWriting}>취소</button>
              <button className="btn-submit" onClick={handleSave}>{isEditing ? '수정완료' : '등록'}</button>
            </div>
          </div>
        ) : (
          <>
            <div className="notice-list">
              {posts.map((post) => (
                <div key={post.id} className="list-item-wrapper">
                  <div onClick={() => setExpandedId(expandedId === post.id ? null : post.id)} className={`list-item-header ${expandedId === post.id ? 'expanded' : ''}`}>
                    <div className="list-item-title-group"><div className="q-icon-circle">Q</div><span className="item-title">{post.title}</span></div>
                    <div className="item-meta">
                      {user && (
                        <div className="notice-item-actions">
                          <span onClick={(e) => startEditing(e, post)} className="notice-action-edit">수정</span>
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

            {totalCount > itemsPerPage && (
              <div className="pagination-container">
                <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt; 이전</button>
                <span className="page-info"><strong>{currentPage}</strong> / {totalPages}</span>
                <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>다음 &gt;</button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
});

export default NoticeSection;