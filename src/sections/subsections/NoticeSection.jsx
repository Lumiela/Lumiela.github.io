import React, { useEffect, useState, forwardRef } from 'react';
import { supabase } from '../../supabaseClient';

const NoticeSection = forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    getSession();
    fetchNotices();
    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('notices').select('*').order('notice_no', { ascending: false });
      if (error) throw error;
      setPosts(data.map((item) => ({
        ...item,
        no: item.notice_no,
        date: item.created_at ? item.created_at.split('T')[0] : '',
      })));
    } catch (error) {
      console.error('불러오기 실패:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (id) => setExpandedId(expandedId === id ? null : id);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    try {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) throw error;
      alert('삭제되었습니다.');
      fetchNotices();
    } catch (error) {
      alert('삭제 실패: ' + error.message);
    }
  };

  const startEditing = (e, post) => {
    e.stopPropagation();
    setTitle(post.title);
    setContent(post.content);
    setEditingId(post.id);
    setIsEditing(true);
  };

  return (
    <section id="notice" ref={ref} className="support-content-section section">
      <div className="sub-section">
        <header className="support-subsection-header">
          <h2>공지사항</h2>
          {user && !isWriting && !isEditing && (
            <button 
              onClick={() => { setTitle(''); setContent(''); setIsWriting(true); }}
              className="notice-write-button"
            >
              글쓰기
            </button>
          )}
        </header>
        <hr className="section-top-line" />
        
        {loading ? (
          <div className="notice-loading">로딩 중...</div>
        ) : (
          <div className="notice-list">
            {posts.map((post) => (
              <div key={post.id} className="list-item-wrapper">
                <div 
                  onClick={() => toggleAccordion(post.id)}
                  className={`list-item-header ${expandedId === post.id ? 'expanded' : ''}`}
                >
                  <div className="list-item-title-group">
                    <div className="q-icon-circle">Q</div>
                    <span className={`item-title ${expandedId === post.id ? 'expanded' : ''}`}>{post.title}</span>
                  </div>
                  <div className="item-meta notice-item-meta">
                    <span className="notice-item-date">{post.date}</span>
                    {user && (
                      <div className="notice-item-actions">
                        <span onClick={(e) => startEditing(e, post)} className="notice-action-edit">수정</span>
                        <span onClick={(e) => handleDelete(e, post.id)} className="notice-action-delete">삭제</span>
                      </div>
                    )}
                    <span>{expandedId === post.id ? '▲' : '▼'}</span>
                  </div>
                </div>
                {expandedId === post.id && (
                  <div className="item-content">
                    {post.content}
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