import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './AdminDashboardPage.css'; // 제공해주신 CSS 적용


const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('write');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('제목과 내용을 입력해주세요.');

    try {
      setUploading(true);
      let fileUrl = '';
      let fileNameForDB = '';

      if (file) {
        // [해결] 파일명 특수문자/한글 에러 방지 로직
        const fileExt = file.name.split('.').pop();
        const safePath = `archives/${Date.now()}.${fileExt}`; // 숫자로 이름 변경
        fileNameForDB = file.name; // 한글 이름은 DB에만 보관

        const { data, error: storageError } = await supabase.storage
          .from('daonrs')
          .upload(safePath, file);

        if (storageError) throw storageError;

        const { data: { publicUrl } } = supabase.storage
          .from('daonrs')
          .getPublicUrl(safePath);
        
        fileUrl = publicUrl;
      }

      // [해결] 정확한 테이블(archives)과 컬럼(file_name) 사용
      const { error: dbError } = await supabase
        .from('archives') 
        .insert([{
          title,
          content,
          file_url: fileUrl,
          file_name: fileNameForDB,
          author: '관리자'
        }]);

      if (dbError) throw dbError;

      alert('등록 완료!');
      setTitle(''); setContent(''); setFile(null);
      setActiveTab('list');
    } catch (error) {
      alert('에러 발생: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h2>관리자 대시보드</h2>
        <div>
          <button className="home-button" onClick={() => window.location.href='/'}>홈으로</button>
          <button className="logout-button" onClick={() => supabase.auth.signOut()}>로그아웃</button>
        </div>
      </header>
      <div className="admin-dashboard-content">
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab('list')}>목록</button>
          <button onClick={() => setActiveTab('write')}>글쓰기</button>
        </div>
        {activeTab === 'write' && (
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} style={{ height: '200px' }} required />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit" disabled={uploading}>{uploading ? '처리 중...' : '등록'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;