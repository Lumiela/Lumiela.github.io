import React from 'react';
import Board from '../../components/Board';

const NoticeSection = () => {
  const posts = [
    { id: 12, title: '2026년 새해 복 많이 받으세요', author: '관리자', date: '2026-01-01', views: 50 },
    { id: 11, title: '시스템 점검 안내 (2025-12-31)', author: '관리자', date: '2025-12-24', views: 120 },
    { id: 10, title: '신제품 출시 예정 (2026-01-15)', author: '관리자', date: '2025-12-20', views: 245 },
    { id: 9, title: '개인정보처리방침 변경 안내', author: '관리자', date: '2025-12-01', views: 500 },
    { id: 8, title: 'CS 운영 시간 변경 안내', author: '관리자', date: '2025-11-15', views: 450 },
    { id: 7, title: '서버 안정화 작업 완료', author: '관리자', date: '2025-11-01', views: 300 },
    { id: 6, title: '홈페이지 리뉴얼 안내', author: '관리자', date: '2025-10-20', views: 600 },
    { id: 5, title: '추석 연휴 배송 안내', author: '관리자', date: '2025-09-10', views: 750 },
    { id: 4, title: '보안 강화 업데이트 안내', author: '관리자', date: '2025-08-25', views: 800 },
    { id: 3, title: '하계 휴무 안내', author: '관리자', date: '2025-07-20', views: 900 },
    { id: 2, title: '신규 서비스 오픈', author: '관리자', date: '2025-06-15', views: 1200 },
    { id: 1, title: '다온알에스 홈페이지 방문을 환영합니다', author: '관리자', date: '2025-06-01', views: 2500 },
  ];

  return (
    <div className="support-content-section">
      <Board posts={posts} />
    </div>
  );
};

export default NoticeSection;

