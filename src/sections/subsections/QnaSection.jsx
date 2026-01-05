import React from 'react';
import Board from '../../components/Board';

const QnaSection = () => {
  const posts = [
    { id: 12, title: '양액기 센서 오류 문의', author: '최**', date: '2026-01-05', views: 3, isPrivate: true, status: '답변대기' },
    { id: 11, title: '제품 관련 문의입니다.', author: '김**', date: '2026-01-04', views: 5, isPrivate: true, status: '답변완료' },
    { id: 10, title: 'AS 신청합니다.', author: '이**', date: '2026-01-03', views: 15, isPrivate: true, status: '답변완료' },
    { id: 9, title: '견적 문의 드립니다.', author: '박**', date: '2026-01-02', views: 22, isPrivate: false, status: '답변대기' },
    { id: 8, title: '복합 환경 제어기 연동 문의', author: '정**', date: '2025-12-28', views: 35, isPrivate: true, status: '답변완료' },
    { id: 7, title: '대량 구매 할인 문의', author: '사업자', date: '2025-12-22', views: 40, isPrivate: false, status: '답변완료' },
    { id: 6, title: '설치 지원 문의', author: '김**', date: '2025-12-15', views: 55, isPrivate: true, status: '답변완료' },
    { id: 5, title: '스마트팜 컨설팅 문의', author: '농업법인', date: '2025-12-10', views: 70, isPrivate: false, status: '답변대기' },
    { id: 4, title: '제품 사용법 문의', author: '이**', date: '2025-12-05', views: 80, isPrivate: true, status: '답변완료' },
    { id: 3, title: '배송 일정 문의', author: '박**', date: '2025-11-28', views: 95, isPrivate: true, status: '답변완료' },
    { id: 2, title: '홈페이지 오류 문의', author: '최**', date: '2025-11-25', views: 110, isPrivate: false, status: '답변완료' },
    { id: 1, title: '회원가입은 어떻게 하나요?', author: '방문객', date: '2025-11-20', views: 200, isPrivate: false, status: '답변완료' },
  ];

  return (
    <div className="support-content-section">
      <Board posts={posts} isQna={true} />
    </div>
  );
};

export default QnaSection;

