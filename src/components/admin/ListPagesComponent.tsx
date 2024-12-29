import {Badge, Table} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import httpClient from '@/api-clients';
import Cookies from 'js-cookie';

export default function ListPagesComponent() {
  const [pagePermissions, setPagePermissions] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const response: any = await httpClient.get({
        url: '/api/admins/page-permissions',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${Cookies.get('access_token')}`
        }
      });
      if (response.statusCode === 200 && response.data) {
        setPagePermissions(response.data.pagePermissions);
      }
    };
    fetch();
  }, []);

  const displayPagePermissions = () => {
    return pagePermissions.map((v: any) => {
      return (
        <tr key={v.id}>
          <td>{v.pageId}</td>
          <td>{v.pageType}</td>
          <td>{
            v.permissions.map((v: any, index: number) => {
              return <div key={index} className="me-2"><Badge bg="secondary">{v}</Badge></div>;
            })
          }</td>
          <td></td>
        </tr>
      );
    });
  };

  return (
    <div className="my-3">
      <Table responsive bordered hover>
        <thead>
          <tr>
            <th>Page Id</th>
            <th>Page Type</th>
            <th>Permissions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayPagePermissions()}
        </tbody>
      </Table>
    </div>
  );
}