import {useEffect, useState} from 'react';

const useServeIpAddressEffect = () => {
  const [ip, setIp] = useState<string>('');

  useEffect(() => {
    const fetchIp = async () => {
      const response = await fetch('/api/ip');
      const data = await response.json();
      setIp(data.ip);
    };
    fetchIp().catch(() => {
      setIp('');
    });
  }, []);

  return {ip};
};

export default useServeIpAddressEffect;