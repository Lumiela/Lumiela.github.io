import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>⚠️</h1>
        <h2>잘못된 페이지 입니다.</h2>
        <p>요청하신 페이지를 찾을 수 없거나, 접근 권한이 없습니다.</p>
        <button className="home-button" onClick={() => navigate('/')}>
          홈으로
        </button>
      </div>
    </div>
  );
};

export default NotFound;
