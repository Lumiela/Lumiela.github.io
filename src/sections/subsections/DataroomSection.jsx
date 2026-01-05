import React from 'react';
import Board from '../../components/Board';

const DataroomSection = () => {
  const posts = [
    { id: 11, title: '2026년 제품 브로슈어', author: '관리자', date: '2026-01-05', views: 25 },
    { id: 10, title: '제품 카탈로그 v3.0', author: '관리자', date: '2025-12-15', views: 150 },
    { id: 9, title: '스마트 온실 제어 시스템 제안서', author: '관리자', date: '2025-11-20', views: 300 },
    { id: 8, title: '양액기 A/S 가이드', author: '관리자', date: '2025-10-30', views: 250 },
    { id: 7, title: '복합 환경 제어기 사용자 매뉴얼 v2.1', author: '관리자', date: '2025-09-15', views: 450 },
    { id: 6, title: '무인방제기 설치 사례', author: '관리자', date: '2025-08-22', views: 500 },
    { id: 5, title: '스마트팜 구축 우수 사례집', author: '관리자', date: '2025-07-18', views: 680 },
    { id: 4, title: '탄산가스 발생기 매뉴얼 v1.5', author: '관리자', date: '2025-06-25', views: 820 },
    { id: 3, title: '스마트 측정 제어기 매뉴얼 v2.0', author: '관리자', date: '2025-05-30', views: 1100 },
    { id: 2, title: '제품 카탈로그 v2.0', author: '관리자', date: '2025-04-10', views: 1500 },
    { id: 1, title: '전체 제품 통합 매뉴얼', author: '관리자', date: '2025-03-01', views: 2800 },
  ];

  return (
    <div className="support-content-section">
      <Board posts={posts} />
    </div>
  );
};

export default DataroomSection;
