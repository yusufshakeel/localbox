import {useEffect, useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {AUTH_PASSWORD_MIN_LENGTH, AUTH_USERNAME_MAX_LENGTH} from '@/configs/auth';
import httpClient from '@/api-clients';
import Cookies from 'js-cookie';
import showToast from '@/utils/show-toast';
import {AccountStatus} from '@/types/account-status';

export default function EditUserModalComponent({ userId }: { userId: string}) {
  const [show, setShow] = useState(false);
  const [isUpdateButtonEnabled, setIsUpdateButtonEnabled] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (show && userId) {
      (async () => {
        const response: any = await httpClient.get({
          url: '/api/admins/users',
          params: { id: userId },
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${Cookies.get('access_token')}`
          }
        });
        if (response.statusCode === 200) {
          setUserDetails(response.data.users[0]);
          setUsername(response.data.users[0].username.trim());
          setAccountStatus(response.data.users[0].accountStatus);
        } else {
          showToast({ content: 'Something went wrong', type: 'error', autoClose: 1000 });
          handleClose();
        }
      })();
    }
  }, [show, userId]);

  useEffect(() => {
    if (username && userDetails?.username !== username) {
      setIsUpdateButtonEnabled(false);
    } else if (password.length >= AUTH_PASSWORD_MIN_LENGTH) {
      setIsUpdateButtonEnabled(false);
    } else if (accountStatus !== userDetails?.accountStatus) {
      setIsUpdateButtonEnabled(false);
    } else {
      setIsUpdateButtonEnabled(true);
    }
  }, [username, password, accountStatus, userDetails]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const body: any = {};
    if (username && userDetails?.username !== username) {
      body['username'] = username;
    }
    if (password.length >= AUTH_PASSWORD_MIN_LENGTH) {
      body['password'] = password;
    }
    if (accountStatus !== userDetails?.accountStatus) {
      body['accountStatus'] = accountStatus;
    }
    if (!Object.keys(body).length) {
      return;
    }
    const response = await httpClient.patch<any>({
      url: '/api/admins/users',
      body: {
        ...body,
        userId
      },
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${Cookies.get('access_token')}`
      }
    });
    if (response.statusCode === 200 && response.data?.userId) {
      showToast({ content: 'Account updated successfully.', type: 'success', autoClose: 1000 });
      setUsername('');
      setPassword('');
      setAccountStatus(null);
      handleClose();
    } else {
      showToast({ content: response.message || 'Something went wrong', type: 'error', autoClose: 1000 });
    }
  };

  return (
    <>
      <Button className="mx-2" variant="primary" onClick={handleShow}>Edit</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            !userDetails
              ? <p>Loading...</p>
              : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Change Username</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={AUTH_USERNAME_MAX_LENGTH}
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value.trim())}
                    />
                    <Form.Text>Current username: {userDetails.username}</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Change Password</Form.Label>
                    <Form.Control
                      type="password"
                      minLength={AUTH_PASSWORD_MIN_LENGTH}
                      value={password}
                      onChange={e => setPassword(e.target.value.trim())}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Change Account Status</Form.Label>
                    <Form.Select defaultValue={accountStatus ?? AccountStatus.inactive}
                      onChange={(e) => setAccountStatus(e.target.value as AccountStatus)}>
                      <option value={AccountStatus.active}>Active</option>
                      <option value={AccountStatus.inactive}>In Active</option>
                      <option value={AccountStatus.suspended}>Suspended</option>
                    </Form.Select>
                    <Form.Text>Current account status: {userDetails.accountStatus}</Form.Text>
                  </Form.Group>
                  <div className="float-end">
                    <Button variant="primary"
                      type="submit"
                      className="ms-3"
                      disabled={isUpdateButtonEnabled}>Update</Button>
                  </div>
                </Form>
              )
          }
        </Modal.Body>
      </Modal>
    </>
  );
}