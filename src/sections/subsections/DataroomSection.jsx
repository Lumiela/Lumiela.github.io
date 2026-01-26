import React, { useEffect, useState, forwardRef } from 'react';
import styled from 'styled-components';
import { supabase } from '../../supabaseClient';
import '../SupportSection.css';

const SectionWrapper = styled.section`
  width: 100%;
`;

const DataroomSection = forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('archives').select('*').order('notice_no', { ascending: false });
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

  const toggleAccordion = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <SectionWrapper id="dataroom" ref={ref}>
      <div className="sub-section">
        <div className="support-content-section">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '40px' }}>자료실</h1>
          <div style={{ borderTop: '2px solid #000', marginBottom: '0' }}></div>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</p>
          ) : (
            <div style={{ width: '100%' }}>
              {posts.map((post) => (
                <div key={post.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <div 
                    onClick={() => toggleAccordion(post.id)}
                    style={{ display: 'flex', alignItems: 'center', padding: '25px 15px', cursor: 'pointer', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ backgroundColor: '#000', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Q</div>
                      <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{post.title}</span>
                    </div>
                    <div style={{ transform: expandedId === post.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                  {expandedId === post.id && (
                    <div style={{ padding: '30px 20px 40px 67px', backgroundColor: '#fcfcfc', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {post.file_url && (
                        <div style={{ padding: '12px 20px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', alignSelf: 'flex-start' }}>
                          <a href={post.file_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>
                            📁 {post.file_name || '파일 다운로드'}
                          </a>
                        </div>
                      )}
                      <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{post.content}</div>
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

export default DataroomSection;