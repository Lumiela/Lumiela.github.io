import React, { useEffect, useState, forwardRef } from 'react';
import { supabase } from '../../supabaseClient';

const DataroomSection = forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('archives').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data.map(item => ({
        ...item,
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
    <section id="dataroom" ref={ref} className="support-content-section section">
      <div className="sub-section">
        <header className="support-subsection-header">
          <h2>자료실</h2>
        </header>
        <hr className="section-top-line" />

        {loading ? (
          <p className="dataroom-loading">로딩 중...</p>
        ) : (
          <div className="dataroom-list">
            {posts.map((post) => (
              <div key={post.id} className="list-item-wrapper">
                <div 
                  onClick={() => toggleAccordion(post.id)}
                  className={`list-item-header ${expandedId === post.id ? 'expanded' : ''}`}
                >
                  <div className="list-item-title-group">
                    <div className="q-icon-circle">D</div>
                    <span className="item-title">{post.title}</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-date">{post.date}</span>
                    <div className={`dataroom-accordion-icon ${expandedId === post.id ? 'expanded' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
                {expandedId === post.id && (
                  <div className="item-content dataroom-item-content">
                    {post.file_url && (
                      <div className="dataroom-file-link-wrapper">
                         <a href={post.file_url} target="_blank" rel="noopener noreferrer" className="dataroom-file-link">
                          📁 {post.file_name || '파일 다운로드'}
                        </a>
                      </div>
                    )}
                    <div className="dataroom-content-text">{post.content}</div>
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

export default DataroomSection;