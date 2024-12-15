import showToast from '@/utils/show-toast';
import {Button, Form, InputGroup} from 'react-bootstrap';
import {useEffect, useRef, useState} from 'react';
import useFileUploadEffect from '@/hooks/useFileUploadEffect';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark, faUpload} from '@fortawesome/free-solid-svg-icons';

export default function FileUploadComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {file, handleFileUpload, error} = useFileUploadEffect({ dir: 'uploads' });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    await handleFileUpload(formData);
  };

  useEffect(() => {
    if (error) {
      showToast({ type: 'error', content: error});
    } else if (file){
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      setSelectedFile(null);
      showToast({ type: 'success', content: 'File uploaded', autoClose: 1000});
    }
  }, [file, error]);

  return (
    <InputGroup>
      <Form.Control
        className="no-focus-border"
        type="file"
        ref={inputRef}
        name="file"
        onChange={handleFileChange}
      />
      <Button variant="primary" onClick={handleUpload}>
        <FontAwesomeIcon icon={faUpload}/> Upload
      </Button>
      <Button variant="outline-danger" onClick={handleReset}>
        <FontAwesomeIcon icon={faXmark}/>
      </Button>
    </InputGroup>
  );
}