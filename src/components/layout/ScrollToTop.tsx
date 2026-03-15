import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Component that scrolls the window to the top on every route change.
 * This ensures that when navigating to a new page, the user starts at the top.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // We use window.scrollTo(0, 0) to instantly move to top.
    // 'smooth' behavior is avoided here to prevent the "automatic scroll down" sensation
    // when a user lands on a new page that previously had a scroll position.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
