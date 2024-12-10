import {useEffect, useState} from 'react';

const useServeIpAddressEffect = () => {
  const [ip, setIp] = useState<string>('');
  const [port, setPort] = useState('');
  const [localServerAddress, setLocalServerAddress] = useState('');

  useEffect(() => {
    const fetchIp = async () => {
      const response = await fetch('/api/ip');
      const data = await response.json();
      setIp(data.ip);

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        setPort(url.port || 'Default Port (e.g., 80 for HTTP or 443 for HTTPS)');
        if (url.port) {
          setLocalServerAddress(`http://${ip}:${port}`);
        } else {
          setLocalServerAddress(`http://${ip}`);
        }
      }
    };
    fetchIp().catch(() => {
      setIp('');
    });
  }, [ip, port]);

  return {ip, port, localServerAddress};
};

export default useServeIpAddressEffect;