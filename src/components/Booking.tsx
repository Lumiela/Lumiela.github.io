import React from 'react';
import Calendar from 'react-calendar';
import { useOutletContext } from 'react-router-dom';
import { useUserSession } from '../hooks/useUserSession';
import { useBookingForm } from '../hooks/useBookingForm';
import { useAuthActions } from '../hooks/useAuthActions'; // 추가
import 'react-calendar/dist/Calendar.css';
import './Booking.css';

const hours = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18','19','20','21','22','23'];

interface StoreContext { storeName: string; ownerId: string; }

const Booking: React.FC = () => {
  const { user, loading } = useUserSession();
  const { ownerId } = useOutletContext<StoreContext>();
  const { signInWithKakao } = useAuthActions(); // 추가
  const {
    date,
    setDate,
    selectedHour,
    setSelectedHour,
    bookingNote,
    setBookingNote,
    submitLoading,
    reservedTimes,
    submitBooking
  } = useBookingForm(user, ownerId);

  const handleSubmit = async () => {
    const { success, error } = await submitBooking();
    if (success) {
      alert("예약 신청 완료!");
    } else if (error) {
      alert(error);
    }
  };

  // 날짜 포맷팅 (YYYY-MM-DD)
  const formatDate = (d: Date | null) => {
    if (!d) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const week = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    return `${year}-${month}-${day} (${week})`;
  };

  if (loading) return <div className="loading-text">로딩 중...</div>;

  return (
    <div className="booking-container content-wrapper">
      <div className="page-header">
        <div className="title-group">
          <h1 className="page-title">예약하기</h1>
          <p className="page-subtitle">원하시는 날짜와 시간을 순서대로 선택해 주세요.</p>
        </div>
      </div>
      
      <div className="booking-steps-wrapper">
        {/* STEP 1: 날짜 선택 */}
        <section className="booking-step-section">
          <div className="section-header">
            <span className="step-number">1</span>
            <h2>날짜 선택</h2>
          </div>
          <div className="calendar-wrapper">
            <Calendar 
              onChange={(d) => { setDate(d as Date); setSelectedHour(''); }} 
              value={date} 
              minDate={new Date()} 
              locale="ko-KR" 
              calendarType="gregory" 
            />
          </div>
          
          <div className="selected-date-banner">
            <span className="date-label">선택된 예약일</span>
            <strong className="date-value">{formatDate(date)}</strong>
            <span className="date-change-guide">(변경하려면 위 달력에서 다른 날짜 클릭)</span>
          </div>
        </section>

        {/* STEP 2: 시간 선택 */}
        <section className="booking-step-section">
          <div className="section-header">
            <span className="step-number">2</span>
            <h3>시간 선택</h3>
          </div>
          <div className="time-grid">
            {hours.map(h => {
              const isToday = date?.toDateString() === new Date().toDateString();
              const currentHour = new Date().getHours();
              const isPast = isToday && parseInt(h) <= currentHour;
              const isReserved = reservedTimes.includes(`${h}:00`);
              const isSelected = selectedHour === h;
              const isDisabled = isPast || isReserved;
              
              return (
                <button 
                  key={h} 
                  className={`time-chip ${isSelected ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                  disabled={isDisabled}
                  onClick={() => {
                    setSelectedHour(h);
                  }}
                >
                  <span className="time-val">{h}:00</span>
                  <span className="status-val">
                    {isReserved ? '마감' : isPast ? '종료' : isSelected ? '선택됨' : '가능'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP 3: 상세 내용 */}
        <section className="booking-step-section">
          <div className="section-header">
            <span className="step-number">3</span>
            <h3>추가 요청사항</h3>
          </div>
          <textarea 
            className="booking-textarea" 
            placeholder="성함, 방문 인원, 원하시는 서비스 내용을 자유롭게 적어주세요." 
            value={bookingNote} 
            onChange={(e) => setBookingNote(e.target.value)} 
          />
        </section>

        {/* 최종 제출 버튼 및 로그인 유도 섹션 수정 */}
        <div className="booking-submit-section">
          {user ? (
            <>
              <button className="submit-btn" onClick={handleSubmit} disabled={submitLoading || !selectedHour}>
                {submitLoading ? '예약 처리 중...' : `${formatDate(date)} ${selectedHour ? selectedHour + ':00' : ''} 예약 신청하기`}
              </button>
              {!selectedHour && <p className="action-hint">날짜와 시간을 모두 선택해 주세요.</p>}
            </>
          ) : (
            <div className="login-prompt-container">
              <p className="login-warn">로그인이 필요한 서비스입니다.</p>
              <button className="kakao-booking-btn" onClick={() => signInWithKakao()}>
                <span className="kakao-icon">💬</span>
                카카오로 로그인하고 예약하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;