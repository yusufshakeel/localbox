import {findIps} from '@/utils/ip';

describe('Testing ip util', () => {
  describe('Testing ', () => {
    it('Should be able to return ip address', () => {
      const obj = {
        en0: [
          {
            address: 'fake::fake:fake:fake:fake',
            family: 'IPv6',
            mac: '00:00:00:00:00:00',
            internal: false,
            cidr: 'fake::fake:fake:fake:fake/64',
            scopeid: 6
          },
          {
            address: '192.168.0.151',
            netmask: '255.255.255.0',
            family: 'IPv4',
            mac: '00:00:00:00:00:00',
            internal: false,
            cidr: '192.168.0.151/24'
          }
        ]
      };
      expect(findIps(obj)).toEqual([
        '192.168.0.151'
      ]);
    });
  });
});