import React, { useEffect, useState } from 'react';
import Board from '../../components/Board';
import { SupportContentSection } from '../SupportSection.styles.js';
import { supabase } from '../../supabaseClient';

const NoticeSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null); 
  const [isWriting, setIsWriting] = useState(false); 
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태 추가
  const [user, setUser] = useState(null); 

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('notice_no', { ascending: false });

      if (error) throw error;

      const formattedData = data.map((item) => ({
        ...item,
        no: item.notice_no,
        date: item.created_at ? item.created_at.split('T')[0] : '',
      }));

      setPosts(formattedData);
    } catch (error) {
      console.error('불러오기 실패:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 글 삭제 함수 ---
  const handleDelete = async (id) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('삭제되었습니다.');
      fetchNotices();
      if (selectedPost?.id === id) setSelectedPost(null);
    } catch (error) {
      alert('삭제 실패: ' + error.message);
    }
  };

  // --- 글 수정 모드 진입 ---
  const startEditing = () => {
    setTitle(selectedPost.title);
    setContent(selectedPost.content);
    setIsEditing(true);
  };

  // --- DB에 수정 내용 저장 ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('notices')
        .update({ title, content })
        .eq('id', selectedPost.id);

      if (error) throw error;

      alert('수정되었습니다.');
      setIsEditing(false);
      setSelectedPost(null); // 수정 후 목록으로 이동
      fetchNotices();
    } catch (error) {
      alert('수정 실패: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('제목과 내용을 입력해주세요.');

    try {
      const { error } = await supabase
        .from('notices')
        .insert([{ title, content, author: user.email }]);

      if (error) throw error;

      alert('등록되었습니다.');
      setTitle('');
      setContent('');
      setIsWriting(false);
      fetchNotices();
    } catch (error) {
      alert('저장 실패: ' + error.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>;

  return (
    <SupportContentSection>
      {/* --- 글쓰기 또는 수정 폼 --- */}
      {(isWriting || isEditing) ? (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>{isEditing ? '공지사항 수정' : '공지사항 작성'}</h3>
          <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
            <input 
              type="text" 
              placeholder="제목을 입력하세요" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <textarea 
              placeholder="내용을 입력하세요" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%', height: '200px', padding: '10px', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setIsWriting(false); setIsEditing(false); }}>취소</button>
              <button type="submit" style={{ backgroundColor: '#000', color: '#fff', padding: '5px 15px' }}>
                {isEditing ? '수정 완료' : '등록'}
              </button>
            </div>
          </form>
        </div>
      ) : selectedPost ? (
        /* --- 상세 보기 화면 --- */
        <div style={{ padding: '20px' }}>
          <h2>{selectedPost.title}</h2>
          <p style={{ color: '#666' }}>작성자: {selectedPost.author} | 날짜: {selectedPost.date}</p>
          <hr />
          <div style={{ minHeight: '200px', whiteSpace: 'pre-wrap' }}>{selectedPost.content}</div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={() => setSelectedPost(null)}>목록으로</button>
            {/* 작성자 본인 확인 로직 (필요시 user.email === selectedPost.author 조건 추가) */}
            {user && (
              <>
                <button onClick={startEditing} style={{ backgroundColor: '#f0ad4e', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '4px' }}>수정</button>
                <button onClick={() => handleDelete(selectedPost.id)} style={{ backgroundColor: '#d9534f', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '4px' }}>삭제</button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* --- 게시판 리스트 화면 --- */
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            {user && (
              <button 
                onClick={() => {
                  setTitle('');
                  setContent('');
                  setIsWriting(true);
                }}
                style={{ padding: '8px 16px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                글쓰기
              </button>
            )}
          </div>
          <Board 
            posts={posts} 
            onItemClick={(post) => setSelectedPost(post)} 
            onDelete={handleDelete} // 삭제 함수 전달
            currentUser={user} // 유저 정보 전달
          />
        </>
      )}
    </SupportContentSection>
  );
};

export default NoticeSection;