import { useState, useEffect, useRef } from 'react';

export const useScrollSpy = (targetRefs, options = {}) => {
  const [activeId, setActiveId] = useState(null);
  const observer = useRef(null);
  // Use a ref to store intersecting elements to avoid re-renders and have access to the latest state.
  const intersectingElements = useRef(new Map());

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    const defaultOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0, // Fire as soon as 1px is visible. App.jsx overrides this, which is fine.
      ...options,
    };

    observer.current = new IntersectionObserver(entries => {
      // 1. Update the map of intersecting elements with the latest status.
      entries.forEach(entry => {
        intersectingElements.current.set(entry.target, entry.isIntersecting);
      });

      // 2. Determine the active ID based on the full list of intersecting elements.
      let lastIntersectingTarget = null;
      // Iterate through the original refs to check in document order.
      for (const ref of targetRefs) {
        // If the ref's element is in our map and its value is `true` (isIntersecting)
        if (ref.current && intersectingElements.current.get(ref.current)) {
            // This element is intersecting. Because we iterate in document order,
            // this will overwrite the previous one, so the last one found will be `lastIntersectingTarget`.
            lastIntersectingTarget = ref.current;
        }
      }

      if (lastIntersectingTarget) {
        // Set the ID of the last intersecting element found.
        setActiveId(lastIntersectingTarget.id);
      } else {
        // Optional: Handle the case where no elements are intersecting.
        // For now, it will just keep the last active ID.
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
  }, [targetRefs, JSON.stringify(options)]); // options object is stringified to ensure effect re-runs if options change.

  return activeId;
};
