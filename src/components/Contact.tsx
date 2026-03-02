import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <div className="contact-container">
      <h1>문의하기</h1>
      <form>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input type="text" id="name" name="name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className="form-group">
          <label htmlFor="message">문의 내용</label>
          <textarea id="message" name="message"></textarea>
        </div>
        <button type="submit">문의하기</button>
      </form>
    </div>
  );
};

export default Contact;
