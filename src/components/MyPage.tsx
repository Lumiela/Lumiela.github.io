import React, { useState } from 'react';
import { useUserSession } from '../hooks/useUserSession';
import { useUserProfile } from '../hooks/useUserProfile';
import { useBookings } from '../hooks/useBookings';
import { supabase } from '../supabaseClient';
import './MyPage.css';

const hours = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];

type TabType = 'active' | 'past' | 'schedule';

const MyPage: React.FC = () => {
  const { user, loading: authLoading } = useUserSession();
  const { role, loading: profileLoading } = useUserProfile(user);
  const { bookings, loading: dataLoading, confirmBooking, completeBooking, cancelBooking, refresh } = useBookings(user, role);

  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockHour, setBlockHour] = useState(new Date().getHours().toString().padStart(2, '0'));
  const [blockLoading, setBlockLoading] = useState(false);

  const isOwner = role === 'owner';
  const todayStr = new Date().toISOString().split('T')[0];
  
  // 전체 데이터 분류 (심플 로직: 본인 가게에 본인이 예약하면 차단, 아니면 고객 예약)
  const blockedBookings = bookings.filter(b => b.user_id === b.owner_id);
  const customerBookings = bookings.filter(b => b.user_id !== b.owner_id);

  // 탭별 카운트
  const activeCount = customerBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
  const pastCount = customerBookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length;
  const scheduleCount = blockedBookings.filter(b => b.status !== 'cancelled').length;
  const pendingCount = customerBookings.filter(b => b.status === 'pending').length;

  // 예약 완료 처리
  const handleComplete = async (id: string) => {
    if (!window.confirm('방문이 완료되었습니까?')) return;
    const { success, error } = await completeBooking(id);
    if (success) {
      alert('완료 처리되었습니다.');
    } else {
      alert(error);
    }
  };

  // 필터링된 예약 목록 (현재 선택된 탭 기준)
  const getFilteredList = () => {
    if (activeTab === 'active') {
      return customerBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
    } else if (activeTab === 'past') {
      return customerBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');
    } else {
      return blockedBookings.filter(b => b.status !== 'cancelled');
    }
  };

  const filteredList = getFilteredList();

  // 시간 비활성화 (차단) 처리
  const handleBlockTime = async () => {
    if (!user) return;
    if (!window.confirm(`${blockDate} ${blockHour}시를 비활성화하시겠습니까?`)) return;

    setBlockLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert([{
        user_id: user.id,
        owner_id: user.id,
        booking_date: blockDate,
        booking_time: `${blockHour}:00`,
        service_name: '사장님 재량 비활성화 (차단)',
        status: 'confirmed'
      }]);

      if (error) {
        if (error.code === '23505') throw new Error('이미 해당 시간에 예약이나 차단 내역이 있습니다.');
        throw error;
      }

      alert('해당 시간이 비활성화되었습니다.');
      refresh();
    } catch (err: any) {
      alert('오류 발생: ' + err.message);
    } finally {
      setBlockLoading(false);
    }
  };

  // 예약 승인 (오너용)
  const handleConfirm = async (id: string) => {
    const { success, error } = await confirmBooking(id);
    if (success) {
      alert('예약이 승인되었습니다.');
    } else {
      alert(error);
    }
  };

  // 예약 취소 (공통)
  const handleCancel = async (id: string) => {
    const reason = prompt('취소 사유를 입력해주세요:');
    if (reason === null) return;

    const { success, error } = await cancelBooking(id, reason);
    if (success) {
      alert('처리가 완료되었습니다.');
    } else {
      alert(error);
    }
  };

  // 사장님 전용 차단 해제
  const handleUnblock = async (id: string) => {
    if (!window.confirm('해당 시간의 차단을 해제하고 다시 예약 가능 상태로 만드시겠습니까?')) return;
    
    // 차단 해제는 내부적으로 '일정 조정'이라는 기본 사유로 취소 처리
    const { success, error } = await cancelBooking(id, '사장님 직접 차단 해제');
    if (success) {
      alert('차단이 해제되었습니다.');
    } else {
      alert(error);
    }
  };

  if (authLoading || profileLoading || dataLoading) {
    return <div className="loading">데이터를 불러오는 중...</div>;
  }

  return (
    <div className="mypage-container content-wrapper">
      <div className="page-header">
        <h1 className="page-title">
          {isOwner ? '내 스토어 예약 관리' : '내 예약 내역'}
          {isOwner && pendingCount > 0 && (
            <span className="pending-badge">신규 {pendingCount}</span>
          )}
        </h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="tab-menu">
        <button className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
          {isOwner ? '예약 관리' : '진행 중 예약'} ({activeCount})
        </button>
        <button className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>
          이전 예약 ({pastCount})
        </button>
        {isOwner && (
          <button className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
            🕒 스케줄 관리 ({scheduleCount})
          </button>
        )}
      </div>

      <div className="tab-content">
        {/* 스케줄 관리 탭: 설정 폼 노출 */}
        {isOwner && activeTab === 'schedule' && (
          <div className="admin-block-section">
            <h3>🕒 예약 불가 시간 추가</h3>
            <p className="section-desc">특정 날짜와 시간대를 선택하여 예약을 차단할 수 있습니다.</p>
            <div className="block-form">
              <input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} min={todayStr} className="block-input" />
              <select value={blockHour} onChange={(e) => setBlockHour(e.target.value)} className="block-select">
                {hours.map(h => <option key={h} value={h}>{h}시</option>)}
              </select>
              <button className="block-btn" onClick={handleBlockTime} disabled={blockLoading}>
                {blockLoading ? '처리 중...' : '해당 시간 예약 받지않기'}
              </button>
            </div>
          </div>
        )}

        <section className="booking-group">
          <h3 className="section-subtitle">
            {activeTab === 'active' ? (isOwner ? '📅 승인 대기 / 확정 예약' : '나의 예약 내역') : 
             activeTab === 'past' ? '📜 종료된 예약 내역' : 
             '🚫 현재 설정된 예약 불가 시간'}
          </h3>
          
          <div className="booking-list">
            {filteredList.length === 0 ? (
              <p className="empty-msg">내역이 없습니다.</p>
            ) : (
              filteredList.map((b) => {
                const isBlocked = b.user_id === b.owner_id;
                const isToday = b.booking_date === todayStr;
                return (
                  <div key={b.id} className={`booking-card ${b.status} ${isBlocked ? 'blocked-card' : ''} ${isToday ? 'today-card' : ''}`}>
                    <div className="card-header">
                      <span className={`status-badge ${b.status}`}>
                        {isBlocked ? '시간 차단됨' : b.status === 'pending' ? '대기중' : b.status === 'confirmed' ? '승인됨' : b.status === 'completed' ? '완료됨' : '취소됨'}
                      </span>
                      {isToday && <span className="today-tag">TODAY</span>}
                      <span className="date-text">{b.booking_date}</span>
                    </div>
                    
                    <div className="card-body">
                      <h3 className="time-text">{b.booking_time}</h3>
                      
                      {isBlocked ? (
                        <div className="blocked-info">
                          <p className="blocked-msg">오너에 의해 예약이 비활성화되었습니다.</p>
                        </div>
                      ) : (
                        <>
                          {isOwner && (
                            <div className="owner-client-info">
                              <p><strong>예약자:</strong> {b.profiles?.full_name || '이름 미등록'}</p>
                              <p><strong>연락처:</strong> {b.profiles?.phone || '번호 미등록'}</p>
                            </div>
                          )}
                          <p className="note-text"><strong>요청사항:</strong> {b.service_name || "없음"}</p>
                        </>
                      )}

                      {b.cancel_reason && (
                        <p className="cancel-reason"><strong>취소사유:</strong> {b.cancel_reason}</p>
                      )}
                    </div>

                    <div className="card-footer">
                      {isOwner && b.status === 'pending' && (
                        <button className="action-btn confirm" onClick={() => handleConfirm(b.id)}>승인</button>
                      )}
                      {isOwner && b.status === 'confirmed' && !isBlocked && (
                        <button className="action-btn complete" onClick={() => handleComplete(b.id)}>완료 처리</button>
                      )}
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button 
                          className={`action-btn ${isBlocked ? 'unblock' : 'cancel'}`} 
                          onClick={() => isBlocked ? handleUnblock(b.id) : handleCancel(b.id)}
                        >
                          {isBlocked ? '차단 해제' : '취소하기'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyPage;
