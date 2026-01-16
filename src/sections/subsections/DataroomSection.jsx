import React, { useEffect, useState } from 'react';
import Board from '../../components/Board';
import { SupportContentSection } from '../SupportSection.styles.js';
import { supabase } from '../../supabaseClient';

const DataroomSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. 유저 세션 및 상태 감지
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    getSession();
    fetchArchives();

    return () => authListener.subscription.unsubscribe();
  }, []);

  // 2. 자료실 데이터(archives 테이블) 불러오기
  const fetchArchives = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('archives') // 자료실 전용 테이블
        .select('*')
        .order('notice_no', { ascending: false });

      if (error) throw error;

      setPosts(data.map(item => ({
        ...item,
        no: item.notice_no,
        date: item.created_at ? item.created_at.split('T')[0] : '',
      })));
    } catch (error) {
      console.error('자료 로딩 실패:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. 자료 삭제 함수
  const handleDelete = async (id) => {
    if (!window.confirm("이 자료를 삭제하시겠습니까?")) return;
    try {
      const { error } = await supabase.from('archives').delete().eq('id', id);
      if (error) throw error;
      alert("삭제되었습니다.");
      setSelectedPost(null);
      fetchArchives();
    } catch (error) {
      alert("삭제 실패: " + error.message);
    }
  };

  return (
    <SupportContentSection>
      {loading ? (
        <p style={{ textAlign: 'center' }}>로딩 중...</p>
      ) : selectedPost ? (
        /* --- 자료 상세 보기 --- */
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2>{selectedPost.title}</h2>
            {user && (
              <button onClick={() => handleDelete(selectedPost.id)} style={{ color: 'red' }}>삭제</button>
            )}
          </div>
          <p style={{ color: '#666' }}>날짜: {selectedPost.date}</p>
          <hr />
          <div style={{ minHeight: '150px', whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
            {selectedPost.content}
          </div>
          
          {/* 첨부파일 다운로드 영역 */}
          {selectedPost.file_url && (
            <div style={{ padding: '15px', backgroundColor: '#f4f4f4', borderRadius: '5px' }}>
              <strong>첨부파일: </strong>
              <a href={selectedPost.file_url} target="_blank" rel="noopener noreferrer" download>
                {selectedPost.file_name || '파일 다운로드'}
              </a>
            </div>
          )}
          
          <button onClick={() => setSelectedPost(null)} style={{ marginTop: '20px' }}>목록으로</button>
        </div>
      ) : (
        /* --- 자료 목록 (Board 컴포넌트 재사용) --- */
        <Board 
          posts={posts} 
          onItemClick={(post) => setSelectedPost(post)} 
          onDelete={handleDelete}
          currentUser={user}
        />
      )}
    </SupportContentSection>
  );
};

export default DataroomSection;