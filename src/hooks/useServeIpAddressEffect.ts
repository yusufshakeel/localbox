import {useEffect, useState} from 'react';
import httpClient from '@/api-clients';
import {IpApiResponse} from '@/types/api-responses';

const useServeIpAddressEffect = () => {
  const [ip, setIp] = useState<string>('');
  const [port, setPort] = useState('');
  const [localServerAddress, setLocalServerAddress] = useState('');

  useEffect(() => {
    const fetchIp = async () => {
      const response = await httpClient.get<IpApiResponse>({ url: '/api/ip' });
      if (response.statusCode === 200) {
        setIp(response.data!.ip);
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          setPort(url.port);
          setLocalServerAddress(url.port? `http://${response.data!.ip}:${port}` : `http://${response.data!.ip}`);
        }
      }
    };
    fetchIp();
  }, [ip, port]);

  return {ip, port, localServerAddress};
};

export default useServeIpAddressEffect;