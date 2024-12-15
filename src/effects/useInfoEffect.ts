import {useEffect, useState} from 'react';
import httpClient from '@/api-clients';
import {InfoType} from '@/types/info-type';

const useInfoEffect = () => {
  const [info, setInfo] = useState<InfoType>();

  useEffect(() => {
    const fetchIp = async () => {
      const response = await httpClient.get<InfoType>('/api/info');
      if (response.statusCode === 200) {
        setInfo(response.data);
      }
    };
    fetchIp();
  }, []);

  return {info};
};

export default useInfoEffect;