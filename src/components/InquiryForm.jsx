import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './InquiryForm.css';

const InquiryForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [confirmEmail, setConfirmEmail] = useState(''); 
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (confirmEmail !== '') {
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1000);
      return;
    }

    const { error: supabaseError } = await supabase
      .from('inquiries')
      .insert([{ name, email, message }]);

    setIsSubmitting(false);

    if (supabaseError) {
      setError('제출에 실패했습니다. 다시 시도해 주세요.');
    } else {
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  if (isSubmitted) {
    return (
      <div className="inquiry-page-wrapper">
        <div className="form-header-line">
          <h2>문의하기</h2>
        </div>
        <div className="thank-you-container">
          <div className="q-bullet">Q</div>
          <p>문의가 정상적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.</p>
          <button className="submit-btn-black" onClick={() => window.location.href = '/'}>홈으로</button>
        </div>
      </div>
    );
  }

  return (
    <div className="inquiry-page-wrapper">
      {/* 상단 굵은 가로줄과 제목 */}
      <div className="form-header-line">
        <h2>문의하기</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="inquiry-linear-form">
        {/* 허니팟 필드 */}
        <div style={{ opacity: 0, position: 'absolute', pointerEvents: 'none', height: 0 }}>
          <input
            type="text"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        {/* 이름 / 입력창 / 이메일 / 입력창 한 줄 배치 */}
        <div className="form-inline-row">
          <div className="inline-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              placeholder="성함 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="inline-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* 문의내용 하단 배치 */}
        <div className="form-block-row">
          <label htmlFor="message">문의 내용</label>
          <textarea
            id="message"
            placeholder="내용을 입력해주세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="10"
            required
          ></textarea>
        </div>
        
        {error && <p className="error-message">{error}</p>}

        <div className="form-footer">
          <button type="submit" className="submit-btn-black" disabled={isSubmitting}>
            {isSubmitting ? '전송 중...' : '작성 완료'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;