import React from 'react';
import './AdminTopNav.css';

const AdminTopNav = ({ onLogout, onGoToDashboard }) => {
  return (
    <div className="admin-top-nav">
      <div className="container">
        <p>관리자 모드로 로그인 중입니다.</p>
        <div>
          <button onClick={onGoToDashboard} className="dashboard-button">대시보드로 이동</button>
          <button onClick={onLogout}>로그아웃</button>
        </div>
      </div>
    </div>
  );
};

export default AdminTopNav;
