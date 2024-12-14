import {Button, Form, Modal} from 'react-bootstrap';
import {useState} from 'react';
import showToastHelper from '@/utils/show-toast';

export type PropType = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  deleteAccount: () => void;
};

export default function DeleteAccountModalComponent(props: PropType) {
  const getCode = () => (Math.random()).toString().substring(2, 8);

  const [deleteAccountText, setDeleteAccountText] = useState(getCode());
  const [confirmDeleteAccountText, setConfirmDeleteAccountText] = useState('');

  const closeModalHandler = () => {
    setDeleteAccountText(getCode());
    props.setShowModal(false);
  };

  const deleteHandler = async () => {
    props.deleteAccount();
    closeModalHandler();
    showToastHelper({content: 'Account Deleted!', type: 'success', autoClose: 1000});
  };

  return (
    <Modal show={props.showModal} onHide={closeModalHandler}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Account?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You are about to delete your account. This is an irreversible action.</p>
        <p>Type <strong>{deleteAccountText}</strong> to continue.</p>
        <Form.Control
          as="input"
          onChange={(e) => setConfirmDeleteAccountText(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger"
          onClick={deleteHandler}
          disabled={confirmDeleteAccountText !== deleteAccountText}>
          Yes, delete my account.
        </Button>
        <Button variant="secondary" onClick={closeModalHandler}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}