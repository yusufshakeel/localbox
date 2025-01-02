import {Table} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import httpClient from '@/api-clients';
import Cookies from 'js-cookie';
import EditUserModalComponent from '@/components/admin/EditUserModalComponent';
import EditUserPagePermissionsModalComponent
  from '@/components/admin/EditUserPagePermissionsModalComponent';

export default function ListUsersComponent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const response: any = await httpClient.get({
        url: '/api/admins/users',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${Cookies.get('access_token')}`
        }
      });
      if (response.statusCode === 200 && response.data) {
        setUsers(response.data.users);
      }
    };
    fetch();
  }, []);

  const displayUsers = () => {
    return users.map((user: any) => {
      return (
        <tr key={user.id}>
          <td>{user.username}</td>
          <td>{user.accountStatus}</td>
          <td>{user.updatedAt}</td>
          <td>
            <EditUserModalComponent userId={user.id} />
            <EditUserPagePermissionsModalComponent userId={user.id} />
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="my-3">
      <Table responsive bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Account Status</th>
            <th>Updated At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayUsers()}
        </tbody>
      </Table>
    </div>
  );
}