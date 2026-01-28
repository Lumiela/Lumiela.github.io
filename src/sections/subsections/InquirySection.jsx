import React, { useState, forwardRef } from 'react';
import { supabase } from '../../supabaseClient';

const InquirySection = forwardRef((props, ref) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [confirmEmail, setConfirmEmail] = useState(''); // Honeypot
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    // Honeypot field check
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

  const renderContent = () => {
    if (isSubmitted) {
      return (
        <div className="thank-you-container">
          <div className="q-icon-circle">✓</div>
          <h3>문의가 정상적으로 접수되었습니다.</h3>
          <p>빠른 시일 내에 답변드리겠습니다.</p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="inquiry-form-wrapper">
        <div style={{ opacity: 0, position: 'absolute', zIndex: -1, pointerEvents: 'none' }}>
          <label htmlFor="confirm_email">Leave this field blank</label>
          <input
            id="confirm_email"
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        <div className="form-row inline-fields inquiry-form-row">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input type="text" id="name" placeholder="성함 입력" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="message">문의 내용</label>
            <textarea id="message" placeholder="내용을 입력해주세요." value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
        </div>
        
        {error && <p className="error-message">{error}</p>}

        <div className="form-footer">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? '전송 중...' : '작성 완료'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <section id="inquiry" ref={ref} className="support-content-section section">
      <div className="sub-section">
        <header className="support-subsection-header">
          <h2>문의하기</h2>
        </header>
        <hr className="section-top-line" />
        {renderContent()}
      </div>
    </section>
  );
});

export default InquirySection;