import {useState} from 'react';

const useUploadProgressEffect = () => {
  const [progress, setProgress] = useState(0);

  const onUploadProgress = (progressEvent: any) => {
    if (progressEvent.total) {
      setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
    }
  };

  return {progress, onUploadProgress, setProgress};
};

export default useUploadProgressEffect;