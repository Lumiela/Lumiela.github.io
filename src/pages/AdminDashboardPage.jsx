import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  // 탭 상태: 'list' (자료실 목록), 'write' (자료실 글쓰기), 'history' (연혁 관리)
  const [activeTab, setActiveTab] = useState('write');
  
  // --- [1] 기존 아카이브(자료실) 관련 상태 ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- [2] 연혁(History) 관리용 상태 ---
  const [historyList, setHistoryList] = useState([]);
  const [isEditingHistory, setIsEditingHistory] = useState(false); // 수정 모드 여부
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  const [historyYear, setHistoryYear] = useState('');
  // 개별 이벤트를 입력받기 위한 배열 상태 (비개발자 친화적)
  const [historyEvents, setHistoryEvents] = useState([{ month: '', content: '' }]);

  // 연혁 데이터 불러오기
  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('order_index', { ascending: false });
    if (!error) setHistoryList(data);
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  // --- [연혁 관리 함수들] ---

  // 이벤트 입력 필드 추가
  const addEventField = () => {
    setHistoryEvents([...historyEvents, { month: '', content: '' }]);
  };

  // 특정 이벤트 입력 필드 삭제
  const removeEventField = (index) => {
    setHistoryEvents(historyEvents.filter((_, i) => i !== index));
  };

  // 이벤트 내용 변경 핸들러
  const handleEventChange = (index, field, value) => {
    const newEvents = [...historyEvents];
    newEvents[index][field] = value;
    setHistoryEvents(newEvents);
  };

  // 연혁 수정 모드 진입
  const startEditHistory = (item) => {
    setIsEditingHistory(true);
    setCurrentHistoryId(item.id);
    setHistoryYear(item.year);
    setHistoryEvents(item.events); // JSON 데이터가 자동으로 배열로 로드됨
    window.scrollTo(0, 0); // 폼이 있는 상단으로 이동
  };

  // 연혁 폼 초기화
  const resetHistoryForm = () => {
    setIsEditingHistory(false);
    setCurrentHistoryId(null);
    setHistoryYear('');
    setHistoryEvents([{ month: '', content: '' }]);
  };

  // 연혁 저장 (추가 및 수정 통합)
  const handleHistorySubmit = async (e) => {
    e.preventDefault();
    
    // 데이터 유효성 검사
    if (!historyYear) return alert('연도를 입력해주세요.');
    
    const payload = {
      year: historyYear,
      events: historyEvents,
      // 신규 추가 시 기존 데이터 중 가장 큰 index + 1
      order_index: isEditingHistory ? undefined : (historyList[0]?.order_index || 0) + 1
    };

    try {
      if (isEditingHistory) {
        const { error } = await supabase
          .from('history')
          .update(payload)
          .eq('id', currentHistoryId);
        if (error) throw error;
        alert('연혁이 수정되었습니다.');
      } else {
        const { error } = await supabase
          .from('history')
          .insert([payload]);
        if (error) throw error;
        alert('새 연혁이 등록되었습니다.');
      }
      resetHistoryForm();
      fetchHistory();
    } catch (error) {
      alert('오류 발생: ' + error.message);
    }
  };

  // 연혁 삭제
  const deleteHistory = async (id) => {
    if (window.confirm('정말 이 연혁을 삭제하시겠습니까?')) {
      const { error } = await supabase.from('history').delete().eq('id', id);
      if (error) alert('삭제 실패: ' + error.message);
      else fetchHistory();
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
        const { data, error: storageError } = await supabase.storage.from('daonrs').upload(safePath, file);
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
        {/* 상단 탭 메뉴 */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab('list')}>자료실 목록</button>
          <button onClick={() => setActiveTab('write')}>자료실 글쓰기</button>
          <button 
            onClick={() => { setActiveTab('history'); resetHistoryForm(); }} 
            style={{ backgroundColor: activeTab === 'history' ? '#2e7d32' : '#4caf50', color: 'white' }}
          >
            연혁 관리
          </button>
        </div>

        {/* 1. 자료실 글쓰기 탭 */}
        {activeTab === 'write' && (
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             <h3>새 자료 등록</h3>
            <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} style={{ height: '200px' }} required />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit" disabled={uploading}>{uploading ? '처리 중...' : '등록'}</button>
          </form>
        )}

        {/* 2. 연혁 관리 탭 (폼 기반 수정 방식) */}
        {activeTab === 'history' && (
          <div className="history-admin-section">
            <h3 style={{ marginBottom: '20px' }}>{isEditingHistory ? '연혁 수정' : '새 연혁 등록'}</h3>
            
            {/* 입력 폼 */}
            <form onSubmit={handleHistorySubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #eee' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>대상 연도</label>
                <input 
                  type="text" 
                  value={historyYear} 
                  onChange={(e) => setHistoryYear(e.target.value)} 
                  placeholder="예: 2025" 
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  required 
                />
              </div>

              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>세부 일정 목록</label>
              {historyEvents.map((event, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="월 (예: 05.22)" 
                    value={event.month} 
                    onChange={(e) => handleEventChange(index, 'month', e.target.value)}
                    style={{ width: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="내용" 
                    value={event.content} 
                    onChange={(e) => handleEventChange(index, 'content', e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    required 
                  />
                  {historyEvents.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEventField(index)}
                      style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0 15px' }}
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={addEventField}
                style={{ marginTop: '5px', backgroundColor: '#1890ff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
              >
                + 일정 추가
              </button>

              <div style={{ display: 'flex', gap: '10px', marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#2e7d32', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isEditingHistory ? '수정사항 저장' : '새 연혁 등록'}
                </button>
                {isEditingHistory && (
                  <button type="button" onClick={resetHistoryForm} style={{ flex: 0.3, backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    취소
                  </button>
                )}
              </div>
            </form>

            {/* 목록 리스트 */}
            <h4>등록된 연혁 목록</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {historyList.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', alignItems: 'center', background: 'white' }}>
                  <div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', marginRight: '10px' }}>{item.year}년</span>
                    <span style={{ color: '#666' }}>이벤트 {item.events.length}개</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEditHistory(item)} style={{ padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>수정</button>
                    <button 
                      onClick={() => deleteHistory(item.id)} 
                      style={{ padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid #ff4d4f', color: '#ff4d4f' }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              {historyList.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>등록된 연혁이 없습니다.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;