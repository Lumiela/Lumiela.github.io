import { useEffect, useRef } from 'react';

export const useScrollSnap = (activeId, sectionIds, options = {}) => {
  const { throttleDuration = 1000, headerOffset = 80 } = options;

  const isScrolling = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      // Don't interfere if not the main body scroll or if we are already scrolling
      if (e.target.closest('.mobile-menu-wrapper') || isScrolling.current) {
        return;
      }
      
      const currentSectionIndex = sectionIds.findIndex(id => id === activeId);
      if (currentSectionIndex === -1) {
        return;
      }

      // Determine scroll direction
      const delta = e.deltaY;
      let nextIndex = currentSectionIndex;

      if (delta > 0) { // Scrolling down
        nextIndex = Math.min(sectionIds.length - 1, currentSectionIndex + 1);
      } else if (delta < 0) { // Scrolling up
        nextIndex = Math.max(0, currentSectionIndex - 1);
      }

      // If there is a section to scroll to, do it
      if (nextIndex !== currentSectionIndex) {
        e.preventDefault();
        isScrolling.current = true;

        const targetId = sectionIds[nextIndex];
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const top = targetElement.offsetTop - headerOffset;
          window.scrollTo({
            top: top,
            behavior: 'smooth',
          });

          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Set a timeout to reset the scrolling flag
          timeoutRef.current = setTimeout(() => {
            isScrolling.current = false;
          }, throttleDuration);
        } else {
           isScrolling.current = false;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeId, sectionIds, throttleDuration, headerOffset]);
};
