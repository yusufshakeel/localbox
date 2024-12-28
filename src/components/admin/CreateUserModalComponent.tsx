import {useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {AUTH_PASSWORD_MIN_LENGTH, AUTH_USERNAME_MAX_LENGTH} from '@/configs/auth';
import httpClient from '@/api-clients';
import Cookies from 'js-cookie';
import showToast from '@/utils/show-toast';

export default function CreateUserModalComponent() {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await httpClient.post<any>({
      url: '/api/admins/users',
      body: { username, password },
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${Cookies.get('access_token')}`
      }
    });
    if (response.statusCode === 200 && response.data?.userId) {
      showToast({ content: 'Account created successfully.', type: 'success', autoClose: 1000 });
      setUsername('');
      setPassword('');
      handleClose();
    } else {
      showToast({ content: response.message || 'Something went wrong', type: 'error', autoClose: 1000 });
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>Create User</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                maxLength={AUTH_USERNAME_MAX_LENGTH}
                required
                value={username}
                onChange={e => setUsername(e.target.value.trim())}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                minLength={AUTH_PASSWORD_MIN_LENGTH}
                required
                value={password}
                onChange={e => setPassword(e.target.value.trim())}
              />
            </Form.Group>
            <div className="float-end">
              <Button variant="primary" type="submit" className="ms-3">Create</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}