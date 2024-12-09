import showToastHelper from '@/utils/show-toast';
import {Button, Form, InputGroup} from 'react-bootstrap';
import {useEffect, useRef} from 'react';
import useFileUploadEffect from '@/effects/useFileUploadEffect';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark, faUpload} from '@fortawesome/free-solid-svg-icons';

export default function FileUploadComponent() {
  const {file, handleFileUpload, error} = useFileUploadEffect();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      showToastHelper({ type: 'error', content: error});
    } else if (file){
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      showToastHelper({ type: 'success', content: 'File uploaded'});
    }
  }, [file, error]);

  return (
    <form onSubmit={handleFileUpload} encType="multipart/form-data">
      <InputGroup>
        <Form.Control type="file" ref={inputRef} name="file" required size="lg"/>
        <Button variant="primary" type="submit">
          <FontAwesomeIcon icon={faUpload}/> Upload
        </Button>
        <Button variant="outline-danger" type="reset">
          <FontAwesomeIcon icon={faXmark}/>
        </Button>
      </InputGroup>
    </form>
  );
}