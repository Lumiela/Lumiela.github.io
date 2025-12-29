import { useState, useEffect, useRef } from 'react';

// options: IntersectionObserver에 전달될 옵션 (root, rootMargin, threshold)
// targetRefs: 감시할 요소들의 ref 배열
export const useScrollSpy = (targetRefs, options = {}) => {
  const [activeId, setActiveId] = useState(null);
  const observer = useRef(null);

  useEffect(() => {
    // 이미 observer 인스턴스가 있다면 연결부터 끊기
    if (observer.current) {
      observer.current.disconnect();
    }

    // 기본 옵션 정의 (rootMargin을 '0px'로 설정하고 threshold 추가)
    const defaultOptions = {
      root: null,
      rootMargin: '0px', // rootMargin을 '0px'로 변경
      threshold: 0.5,     // threshold를 0.5로 설정
      ...options,
    };

    observer.current = new IntersectionObserver(entries => {
      let currentActiveId = null;
      let maxRatio = 0;

      // 현재 뷰포트에 보이는 요소들 중 가장 많이 보이는 요소를 찾음
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            currentActiveId = entry.target.id;
          }
        }
      });

      // 가장 많이 보이는 요소가 있을 경우, activeId를 업데이트
      // 이렇게 하면 섹션 사이를 스크롤할 때 active 상태가 비어있지 않게 됨
      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    }, defaultOptions);

    const { current: currentObserver } = observer;
    targetRefs.forEach(ref => {
      if (ref.current) {
        currentObserver.observe(ref.current);
      }
    });

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRefs, JSON.stringify(options)]); // options 객체가 변경될 때도 effect 재실행

  return activeId;
};
