import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('history'); // 기본 탭을 연혁으로 변경
  
  const [historyList, setHistoryList] = useState([]);
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  const [historyYear, setHistoryYear] = useState('');
  const [historyEvents, setHistoryEvents] = useState([{ month: '', content: '' }]);

  const [inquiryList, setInquiryList] = useState([]);
  const [loadingInquiry, setLoadingInquiry] = useState(false);

  const fetchData = async () => {
    if (activeTab === 'history') {
      const { data, error } = await supabase.from('history').select('*').order('order_index', { ascending: false });
      if (!error) setHistoryList(data || []);
    } 
    else if (activeTab === 'inquiry') {
      setLoadingInquiry(true);
      const { data, error } = await supabase.from('inquiries').select('*').eq('is_read', false).order('created_at', { ascending: false });
      if (!error) setInquiryList(data || []);
      setLoadingInquiry(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleMarkAsRead = async (id) => {
    const { error } = await supabase.from('inquiries').update({ is_read: true }).eq('id', id);
    if (!error) setInquiryList(inquiryList.filter(item => item.id !== id));
  };

  const addEventField = () => setHistoryEvents([...historyEvents, { month: '', content: '' }]);
  const removeEventField = (index) => setHistoryEvents(historyEvents.filter((_, i) => i !== index));
  const handleEventChange = (index, field, value) => {
    const newEvents = [...historyEvents];
    newEvents[index][field] = value;
    setHistoryEvents(newEvents);
  };
  const resetHistoryForm = () => {
    setIsEditingHistory(false);
    setCurrentHistoryId(null);
    setHistoryYear('');
    setHistoryEvents([{ month: '', content: '' }]);
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
          <button className={activeTab === 'history' ? 'active' : ''} onClick={() => { setActiveTab('history'); resetHistoryForm(); }}>연혁 관리</button>
          <button className={activeTab === 'inquiry' ? 'active' : ''} onClick={() => setActiveTab('inquiry')}>
            문의 관리 {inquiryList.length > 0 && <span className="inquiry-badge">{inquiryList.length}</span>}
          </button>
          <button className="nav-to-main" onClick={() => window.location.href='/support#notice'}>게시판 관리 (메인)</button>
        </div>

        {activeTab === 'history' && (
          <div className="history-admin-section">
            <h3 className="section-title">{isEditingHistory ? '연혁 수정' : '새 연혁 등록'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const payload = { year: historyYear, events: historyEvents };
              if (isEditingHistory) await supabase.from('history').update(payload).eq('id', currentHistoryId);
              else await supabase.from('history').insert([payload]);
              alert('저장되었습니다.');
              resetHistoryForm();
              fetchData();
            }} className="history-form">
              <input type="text" value={historyYear} onChange={(e) => setHistoryYear(e.target.value)} placeholder="연도" required />
              {historyEvents.map((event, index) => (
                <div key={index} className="form-row">
                  <input type="text" placeholder="월" value={event.month} onChange={(e)=>handleEventChange(index, 'month', e.target.value)} required />
                  <input type="text" placeholder="내용" value={event.content} onChange={(e)=>handleEventChange(index, 'content', e.target.value)} required />
                  <button type="button" onClick={() => removeEventField(index)}>삭제</button>
                </div>
              ))}
              <button type="button" onClick={addEventField}>+ 일정 추가</button>
              <button type="submit">저장</button>
            </form>
          </div>
        )}

        {activeTab === 'inquiry' && (
          <div className="inquiry-admin-section">
            <h3 className="section-title">미처리 문의 내역</h3>
            {inquiryList.map(inquiry => (
              <div key={inquiry.id} className="inquiry-card">
                <p><strong>{inquiry.name}</strong> ({new Date(inquiry.created_at).toLocaleDateString()})</p>
                <p className="inquiry-content">{inquiry.message}</p>
                <button onClick={() => handleMarkAsRead(inquiry.id)} className="btn-complete">처리 완료</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;