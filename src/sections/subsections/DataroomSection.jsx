import React, { useEffect, useState, forwardRef, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '../../supabaseClient';
import { createImageHandler, getEditorModules } from '../../hooks/editorHandlers';

const DataroomSection = forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [user, setUser] = useState(null);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const BUCKET_NAME = 'daonrs';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
  }, []);

  useEffect(() => {
    fetchArchives();
  }, [currentPage]);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, count, error } = await supabase
        .from('archives')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error) {
        setPosts(data.map(item => ({ ...item, date: item.created_at?.split('T')[0] })));
        setTotalCount(count || 0);
      }
    } finally { setLoading(false); }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (ref && ref.current) {
      window.scrollTo({ top: ref.current.offsetTop - 100, behavior: 'smooth' });
    }
  };

  const handler = useMemo(() => createImageHandler(quillRef, 'archives'), []);
  const modules = useMemo(() => getEditorModules(handler), [handler]);

  const handleSave = async () => {
    if (!title || !content) return alert('입력 확인');
    try {
        const postData = { title, content, author: '관리자' };
        if (isEditing) {
            await supabase.from('archives').update(postData).eq('id', editingId);
        } else {
            await supabase.from('archives').insert([postData]);
            setCurrentPage(1);
        }
        cancelWriting(); fetchArchives();
    } catch (e) { alert(e.message); }
  };

  // 삭제 기능 추가
  const handleDelete = async (e, post) => {
    e.stopPropagation();
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await supabase.from('archives').delete().eq('id', post.id);
      alert('삭제되었습니다.');
      fetchArchives();
    } catch (err) { alert(err.message); }
  };

  const startEditing = (e, post) => {
    e.stopPropagation(); setIsEditing(true); setEditingId(post.id);
    setTitle(post.title); setContent(post.content); setIsWriting(true);
  };

  const cancelWriting = () => {
    setIsWriting(false); setIsEditing(false); setTitle(''); setContent(''); setFile(null);
  };

  return (
    <section id="dataroom" ref={ref} className="section">
      <div className="sub-section">
        <header className="subsection-header">
          <h2 className="subsection-title">자료실</h2>
          {user && !isWriting && <button onClick={() => setIsWriting(true)} className="notice-write-button">글쓰기</button>}
        </header>
        <hr className="section-top-line" />

        {isWriting ? (
          <div className="cafe-editor-container">
            <input type="text" className="editor-title-input" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <div className="quill-wrapper"><ReactQuill ref={quillRef} value={content} onChange={setContent} modules={modules} /></div>
            <div className="editor-footer">
              <button className="btn-cancel" onClick={cancelWriting}>취소</button>
              <button className="btn-submit" onClick={handleSave}>등록</button>
            </div>
          </div>
        ) : (
          <>
            <div className="dataroom-list">
              {posts.map((post) => (
                <div key={post.id} className="list-item-wrapper">
                  <div onClick={() => setExpandedId(expandedId === post.id ? null : post.id)} className="list-item-header">
                    <div className="list-item-title-group"><div className="q-icon-circle">D</div><span className="item-title">{post.title}</span></div>
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
                    <div className="item-content ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} />
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

export default DataroomSection;