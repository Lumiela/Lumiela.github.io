import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  // 탭 상태: 'write' (자료실), 'history' (연혁), 'inquiry' (문의)
  const [activeTab, setActiveTab] = useState('write');
  
  // --- [1] 기존 아카이브(자료실) 관련 상태 ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- [2] 연혁(History) 관리용 상태 ---
  const [historyList, setHistoryList] = useState([]);
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  const [historyYear, setHistoryYear] = useState('');
  const [historyEvents, setHistoryEvents] = useState([{ month: '', content: '' }]);

  // --- [3] 문의 관리(Inquiry) 관리용 상태 ---
  const [inquiryList, setInquiryList] = useState([]);
  const [loadingInquiry, setLoadingInquiry] = useState(false);

  // 데이터 불러오기 로직
  const fetchData = async () => {
    if (activeTab === 'history') {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('order_index', { ascending: false });
      if (!error) setHistoryList(data);
    } 
    else if (activeTab === 'inquiry') {
      setLoadingInquiry(true);
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('is_read', false) // 처리되지 않은 문의만 로드
        .order('created_at', { ascending: false });
      if (!error) setInquiryList(data || []);
      setLoadingInquiry(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- [문의 관리 함수] ---
  const handleMarkAsRead = async (id) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      alert('상태 업데이트에 실패했습니다.');
    } else {
      // 목록에서 즉시 제거하여 UX 향상
      setInquiryList(inquiryList.filter(item => item.id !== id));
    }
  };

  // --- [연혁 관리 함수들] ---
  const addEventField = () => setHistoryEvents([...historyEvents, { month: '', content: '' }]);
  const removeEventField = (index) => setHistoryEvents(historyEvents.filter((_, i) => i !== index));
  const handleEventChange = (index, field, value) => {
    const newEvents = [...historyEvents];
    newEvents[index][field] = value;
    setHistoryEvents(newEvents);
  };
  const startEditHistory = (item) => {
    setIsEditingHistory(true);
    setCurrentHistoryId(item.id);
    setHistoryYear(item.year);
    setHistoryEvents(item.events);
    window.scrollTo(0, 0);
  };
  const resetHistoryForm = () => {
    setIsEditingHistory(false);
    setCurrentHistoryId(null);
    setHistoryYear('');
    setHistoryEvents([{ month: '', content: '' }]);
  };

  const handleHistorySubmit = async (e) => {
    e.preventDefault();
    if (!historyYear) return alert('연도를 입력해주세요.');
    const payload = {
      year: historyYear,
      events: historyEvents,
      order_index: isEditingHistory ? undefined : (historyList[0]?.order_index || 0) + 1
    };
    try {
      if (isEditingHistory) {
        const { error } = await supabase.from('history').update(payload).eq('id', currentHistoryId);
        if (error) throw error;
        alert('연혁이 수정되었습니다.');
      } else {
        const { error } = await supabase.from('history').insert([payload]);
        if (error) throw error;
        alert('새 연혁이 등록되었습니다.');
      }
      resetHistoryForm();
      fetchData();
    } catch (error) {
      alert('오류 발생: ' + error.message);
    }
  };

  const deleteHistory = async (id) => {
    if (window.confirm('정말 이 연혁을 삭제하시겠습니까?')) {
      const { error } = await supabase.from('history').delete().eq('id', id);
      if (error) alert('삭제 실패: ' + error.message);
      else fetchData();
    }
  };

  // --- [자료실 업로드 함수] ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('제목과 내용을 입력해주세요.');
    try {
      setUploading(true);
      let fileUrl = '';
      let fileNameForDB = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const safePath = `archives/${Date.now()}.${fileExt}`;
        fileNameForDB = file.name;
        const { error: storageError } = await supabase.storage.from('daonrs').upload(safePath, file);
        if (storageError) throw storageError;
        const { data: { publicUrl } } = supabase.storage.from('daonrs').getPublicUrl(safePath);
        fileUrl = publicUrl;
      }
      const { error: dbError } = await supabase.from('archives').insert([{
        title, content, file_url: fileUrl, file_name: fileNameForDB, author: '관리자'
      }]);
      if (dbError) throw dbError;
      alert('등록 완료!');
      setTitle(''); setContent(''); setFile(null);
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
        <div className="admin-tabs">
          <button className={activeTab === 'write' ? 'active' : ''} onClick={() => setActiveTab('write')}>자료실 글쓰기</button>
          <button className={activeTab === 'history' ? 'active' : ''} onClick={() => { setActiveTab('history'); resetHistoryForm(); }}>연혁 관리</button>
          <button className={activeTab === 'inquiry' ? 'active' : ''} onClick={() => setActiveTab('inquiry')}>
            문의 관리 {inquiryList.length > 0 && <span className="inquiry-badge">{inquiryList.length}</span>}
          </button>
        </div>

        {/* [자료실 탭] */}
        {activeTab === 'write' && (
          <form onSubmit={handleUpload} className="admin-form">
            <h3>새 자료 등록</h3>
            <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} className="textarea-large" required />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit" disabled={uploading}>{uploading ? '처리 중...' : '등록'}</button>
          </form>
        )}

        {/* [연혁 관리 탭] */}
        {activeTab === 'history' && (
          <div className="history-admin-section">
            <h3 className="section-title">{isEditingHistory ? '연혁 수정' : '새 연혁 등록'}</h3>
            <form onSubmit={handleHistorySubmit} className="history-form">
              <div className="form-group">
                <label className="form-label">대상 연도</label>
                <input type="text" value={historyYear} onChange={(e) => setHistoryYear(e.target.value)} placeholder="예: 2025" required />
              </div>
              <label className="form-label">세부 일정 목록</label>
              {historyEvents.map((event, index) => (
                <div key={index} className="form-row">
                  <input type="text" placeholder="월" value={event.month} onChange={(e) => handleEventChange(index, 'month', e.target.value)} className="input-month" required />
                  <input type="text" placeholder="내용" value={event.content} onChange={(e) => handleEventChange(index, 'content', e.target.value)} className="input-full" required />
                  {historyEvents.length > 1 && <button type="button" onClick={() => removeEventField(index)} className="btn-delete">삭제</button>}
                </div>
              ))}
              <button type="button" onClick={addEventField} className="btn-add">+ 일정 추가</button>
              <div className="form-actions">
                <button type="submit" className="btn-submit">{isEditingHistory ? '수정사항 저장' : '새 연혁 등록'}</button>
                {isEditingHistory && <button type="button" onClick={resetHistoryForm} className="btn-cancel">취소</button>}
              </div>
            </form>
            <h4>등록된 연혁 목록</h4>
            <div className="history-list">
              {historyList.map(item => (
                <div key={item.id} className="history-list-item">
                  <div><span className="history-item-year">{item.year}년</span></div>
                  <div className="history-list-actions">
                    <button onClick={() => startEditHistory(item)} className="btn-edit">수정</button>
                    <button onClick={() => deleteHistory(item.id)} className="btn-delete-outline">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* [문의 관리 탭] */}
        {activeTab === 'inquiry' && (
          <div className="inquiry-admin-section">
            <h3 className="section-title">미처리 문의 내역</h3>
            {loadingInquiry ? <p>로딩 중...</p> : (
              <div className="inquiry-list">
                {inquiryList.length === 0 ? <p className="no-data">새로운 문의가 없습니다.</p> : 
                  inquiryList.map(inquiry => (
                    <div key={inquiry.id} className="inquiry-card">
                      <div className="inquiry-info">
                        <strong>{inquiry.name}</strong> ({new Date(inquiry.created_at).toLocaleDateString()})
                        <br />
                        <a href={`mailto:${inquiry.email}`} className="email-link">{inquiry.email}</a>
                      </div>
                      <div className="inquiry-content">{inquiry.message}</div>
                      <button onClick={() => handleMarkAsRead(inquiry.id)} className="btn-complete">처리 완료</button>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;