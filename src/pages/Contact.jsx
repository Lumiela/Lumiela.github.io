import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제 폼 제출 로직은 여기에 구현합니다.
    // 예: API로 데이터 전송
    alert(`이름: ${formData.name}\n이메일: ${formData.email}\n메시지: ${formData.message}`);
    // 폼 초기화
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <section className="section contact-section">
      <div className="container contact-container">
        <h2 className="section-title">연락처</h2>
        <p>
          궁금한 점이 있거나 함께 일하고 싶으시다면 언제든지 아래 양식을 통해 연락 주세요.
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message" className="form-label">메시지</label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button">
            보내기
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;