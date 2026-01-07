import React from 'react';
import './AdminDashboardPage.css';
import {supabase} from '../supabaseClient';

const AdminDashboardPage = ({ onLogout }) => {

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h2>관리자 대시보드</h2>
        <button onClick={handleLogout} className="logout-button">로그아웃</button>
      </div>
      <div className="admin-dashboard-content">
        <p>로그인에 성공했습니다. 여기에 관리자 콘텐츠를 추가할 수 있습니다.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
