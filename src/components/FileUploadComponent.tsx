import showToastHelper from '@/utils/show-toast';
import {Button, Form, InputGroup} from 'react-bootstrap';
import {useRef} from 'react';

export default function FileUploadComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showToastHelper({
          content: 'File uploaded',
          type: 'success'
        });
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      } else {
        showToastHelper({
          content: 'Failed to upload file',
          type: 'error'
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      showToastHelper({
        content: 'An error occurred',
        type: 'error'
      });
    }
  };

  return (
    <form onSubmit={handleFileUpload} encType="multipart/form-data">
      <InputGroup className="shadow rounded">
        <Form.Control type="file" ref={inputRef} name="file" required size="lg"/>
        <Button variant="primary" type="submit">Upload</Button>
        <Button variant="outline-danger" type="reset">X</Button>
      </InputGroup>
    </form>
  );
}