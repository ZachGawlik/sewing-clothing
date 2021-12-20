import * as React from 'react';

export const useAppHeight = () => {
  React.useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);

    return window.addEventListener('resize', setAppHeight);
  }, []);
};
