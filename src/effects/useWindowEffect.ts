import {useEffect, useState} from 'react';

const useWindowEffect = () => {
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  useEffect(() => {
    // Set heights on mount
    setViewportHeight(window.innerHeight);

    // Update on resize
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { viewportHeight };
};

export default useWindowEffect;