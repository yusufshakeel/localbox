import {useEffect, useState} from 'react';
import {Badge, Button, Form, Modal} from 'react-bootstrap';
import httpClient from '@/api-clients';
import Cookies from 'js-cookie';
import showToast from '@/utils/show-toast';

export default function EditUserPagePermissionsModalComponent({ userId }: { userId: string}) {
  const [show, setShow] = useState(false);
  const [isUpdateButtonEnabled, setIsUpdateButtonEnabled] = useState(true);
  const [pagePermissions, setPagePermissions] = useState([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [allPagePermissions, setAllPagePermissions] = useState([]);

  useEffect(() => {
    (async () => {
      const response: any = await httpClient.get({
        url: '/api/admins/page-permissions',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${Cookies.get('access_token')}`
        }
      });
      if (response.statusCode === 200) {
        setAllPagePermissions(response.data.pagePermissions);
      }
    })();
  }, []);

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
          setPagePermissions(response.data.users[0].rbac.permissions.sort());
        } else {
          showToast({ content: 'Something went wrong', type: 'error', autoClose: 1000 });
          handleClose();
        }
      })();
    }
  }, [show, userId]);

  useEffect(() => {
    if (pagePermissions.sort().join(',') !== userDetails?.rbac?.permissions?.sort().join(',')) {
      setIsUpdateButtonEnabled(false);
    } else {
      setIsUpdateButtonEnabled(true);
    }
  }, [pagePermissions, userDetails]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const body: any = {};
    if (pagePermissions.sort().join(',') !== userDetails.rbac.permissions.sort().join(',')) {
      body['permissions'] = pagePermissions.sort();
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
      setPagePermissions([]);
      handleClose();
    } else {
      showToast({ content: response.message || 'Something went wrong', type: 'error', autoClose: 1000 });
    }
  };

  return (
    <>
      <Button className="mx-2" variant="primary" onClick={handleShow}>Permissions</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Permissions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            !userDetails
              ? <p>Loading...</p>
              : (
                <Form onSubmit={handleSubmit}>
                  {
                    (allPagePermissions.map((v: any) => v.permissions)).flat().map(v => {
                      return (<div key={v}><Badge>{v}</Badge></div>);
                    })
                  }
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