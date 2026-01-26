import React, { forwardRef } from 'react';
import NoticeSection from './subsections/NoticeSection';
import DataroomSection from './subsections/DataroomSection';
import QnaSection from './subsections/QnaSection';

const SupportSection = forwardRef((props, ref) => {
  // BusinessSection과 동일하게 상위에서 전달된 ref 객체를 해체합니다.
  const { noticeRef, dataroomRef, inquiryRef } = ref;

  return (
    <>
      {/* 기존의 컨테이너들을 제거하고 Fragment로 묶어 
        하위 섹션들이 직접적으로 100vh를 적용받을 수 있는 구조로 변경합니다.
      */}
      <NoticeSection ref={noticeRef} />
      <DataroomSection ref={dataroomRef} />
      <QnaSection ref={inquiryRef} />
    </>
  );
});

export default SupportSection;