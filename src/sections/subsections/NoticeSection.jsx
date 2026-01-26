import React, { useEffect, useState, forwardRef } from 'react';
import styled from 'styled-components';
import { supabase } from '../../supabaseClient';
import '../SupportSection.css';

const SectionWrapper = styled.section`
  width: 100%;
`;

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
    <SectionWrapper id="notice" ref={ref}>
      <div className="sub-section">
        <div className="support-content-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>공지사항</h2>
            {user && !isWriting && !isEditing && (
              <button 
                onClick={() => { setTitle(''); setContent(''); setIsWriting(true); }}
                style={{ padding: '8px 16px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                글쓰기
              </button>
            )}
          </div>
          <hr style={{ border: '0', borderTop: '2px solid #000', marginBottom: '0' }} />
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
          ) : (
            <div style={{ width: '100%' }}>
              {posts.map((post) => (
                <div key={post.id} style={{ borderBottom: '1px solid #eee' }}>
                  <div 
                    onClick={() => toggleAccordion(post.id)}
                    style={{ 
                      display: 'flex', alignItems: 'center', padding: '20px 10px', cursor: 'pointer',
                      justifyContent: 'space-between', backgroundColor: expandedId === post.id ? '#fcfcfc' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      <div style={{ backgroundColor: '#000', color: '#fff', borderRadius: '50%', minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>Q</div>
                      <span style={{ fontWeight: expandedId === post.id ? 'bold' : 'normal', fontSize: '15px' }}>{post.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#999', fontSize: '13px' }}>
                      <span style={{ minWidth: '80px', textAlign: 'center' }}>{post.date}</span>
                      {user && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span onClick={(e) => startEditing(e, post)} style={{ cursor: 'pointer', color: '#666' }}>수정</span>
                          <span onClick={(e) => handleDelete(e, post.id)} style={{ cursor: 'pointer', color: '#ff4d4f' }}>삭제</span>
                        </div>
                      )}
                      <span>{expandedId === post.id ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {expandedId === post.id && (
                    <div style={{ padding: '25px 25px 35px 55px', backgroundColor: '#f9f9f9', whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#444', fontSize: '15px', borderTop: '1px solid #f0f0f0' }}>
                      {post.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
});

export default NoticeSection;