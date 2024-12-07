import {useEffect, useState} from 'react';
import {InfoType} from '@/pages/api/info';

const useInfoEffect = () => {
  const [info, setInfo] = useState<InfoType>();

  useEffect(() => {
    const fetchIp = async () => {
      const response = await fetch('/api/info');
      const data = await response.json();
      setInfo(data);
    };
    fetchIp();
  }, []);

  return {info};
};

export default useInfoEffect;