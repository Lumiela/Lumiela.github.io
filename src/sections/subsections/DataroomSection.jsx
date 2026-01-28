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
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const BUCKET_NAME = 'daonrs'; // 버킷 이름 통일

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
      const { data, error } = await supabase.from('archives').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data.map(item => ({ ...item, date: item.created_at?.split('T')[0] })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handler = useMemo(() => createImageHandler(quillRef, 'archives'), []);
  const modules = useMemo(() => getEditorModules(handler), [handler]);

  const handleSave = async () => {
    if (!title || !content) return alert('제목과 내용을 입력하세요.');
    
    let fileUrl = null;
    let fileName = null;

    try {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileNameGen = `files/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileNameGen, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileNameGen);
        
        fileUrl = publicUrl;
        fileName = file.name;
      }

      const postData = { 
        title, 
        content, 
        author: '관리자',
        file_url: fileUrl,
        file_name: fileName
      };

      if (isEditing) {
        const { error } = await supabase.from('archives').update(postData).eq('id', editingId);
        if (error) throw error;
        alert('수정되었습니다.');
      } else {
        const { error } = await supabase.from('archives').insert([postData]);
        if (error) throw error;
        alert('등록되었습니다.');
      }
      cancelWriting();
      fetchArchives();
    } catch (error) {
      alert('저장 중 오류가 발생했습니다: ' + error.message);
    }
  };

  // ✅ 삭제 로직 수정: 파일 삭제 기능 추가
  const handleDelete = async (e, post) => {
    e.stopPropagation();
    if (!window.confirm('정말 삭제하시겠습니까? 관련 첨부파일도 함께 삭제됩니다.')) return;

    try {
      // 1. 첨부파일이 있는 경우 Storage에서 먼저 삭제
      if (post.file_url) {
        // publicUrl에서 파일 경로(path)만 추출하는 로직
        // 예: .../storage/v1/object/public/daonrs/files/123_abc.jpg -> files/123_abc.jpg
        const urlParts = post.file_url.split(`${BUCKET_NAME}/`);
        const filePath = urlParts[urlParts.length - 1];

        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);
          
          if (storageError) console.error('Storage 파일 삭제 실패:', storageError);
        }
      }

      // 2. 본문에 포함된 이미지들도 삭제하고 싶다면 추가 로직이 필요하지만, 
      //    일반적으로는 첨부파일(file_url) 위주로 삭제를 관리합니다.

      // 3. DB 레코드 삭제
      const { error: dbError } = await supabase.from('archives').delete().eq('id', post.id);
      if (dbError) throw dbError;

      alert('삭제되었습니다.');
      fetchArchives();
    } catch (error) {
      alert('삭제 처리 중 오류가 발생했습니다: ' + error.message);
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
    setFile(null);
  };

  return (
    <section id="dataroom" ref={ref} className="support-content-section section">
      <div className="sub-section">
        <header className="support-subsection-header">
          <h2>자료실</h2>
          {user && !isWriting && <button onClick={() => setIsWriting(true)} className="notice-write-button">글쓰기</button>}
        </header>
        <hr className="section-top-line" />

        {isWriting ? (
          <div className="cafe-editor-container">
            <input type="text" className="editor-title-input" placeholder="제목을 입력하세요" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <div className="quill-wrapper">
              <ReactQuill ref={quillRef} theme="snow" value={content} onChange={setContent} modules={modules} placeholder="본문 중간에 사진을 넣으려면 이미지 아이콘을 클릭하세요." />
            </div>
            
            <div className="file-upload-section" style={{ padding: '15px', border: '1px solid #ddd', borderTop: 'none', background: '#fcfcfc' }}>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
              <button type="button" onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer', padding: '6px 12px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}>
                📎 파일 첨부하기
              </button>
              {file && <span style={{ marginLeft: '10px', fontSize: '14px', color: '#555' }}>{file.name}</span>}
            </div>

            <div className="editor-footer">
              <button className="btn-cancel" onClick={cancelWriting}>취소</button>
              <button className="btn-submit" onClick={handleSave}>{isEditing ? '수정완료' : '등록'}</button>
            </div>
          </div>
        ) : (
          <div className="dataroom-list">
            {loading ? <div style={{padding: '20px', textAlign: 'center'}}>로딩 중...</div> : 
              posts.map((post) => (
              <div key={post.id} className="list-item-wrapper">
                <div onClick={() => setExpandedId(expandedId === post.id ? null : post.id)} className={`list-item-header ${expandedId === post.id ? 'expanded' : ''}`}>
                  <div className="list-item-title-group">
                    <div className="q-icon-circle">D</div>
                    <span className={`item-title ${expandedId === post.id ? 'expanded' : ''}`}>{post.title}</span>
                  </div>
                  <div className="item-meta">
                    {user && (
                      <div className="notice-item-actions">
                        <span onClick={(e) => startEditing(e, post)} className="notice-action-edit">수정</span>
                        {/* ✅ handleDelete에 id 대신 post 전체를 전달 */}
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
                    {post.file_url && (
                      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>첨부파일 다운로드:</p>
                        <a href={post.file_url} target="_blank" rel="noopener noreferrer" download={post.file_name} style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
                          💾 {post.file_name}
                        </a>
                      </div>
                    )}
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