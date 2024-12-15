import {useEffect, useState} from 'react';
import httpClient from '@/api-clients';
import {InfoApiResponse} from '@/types/api-responses';

const useInfoEffect = () => {
  const [info, setInfo] = useState<InfoApiResponse>();

  useEffect(() => {
    const fetchIp = async () => {
      const response = await httpClient.get<InfoApiResponse>({ url: '/api/info' });
      if (response.statusCode === 200) {
        setInfo(response.data);
      }
    };
    fetchIp();
  }, []);

  return {info};
};

export default useInfoEffect;