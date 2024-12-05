import showToastHelper from '@/utils/show-toast';
import {Button, Form, InputGroup} from 'react-bootstrap';

export default function FileUploadComponent() {
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
      <InputGroup>
        <Form.Control type="file" name="file" required size="lg"/>
        <Button variant="primary" type="submit">Upload</Button>
      </InputGroup>
    </form>
  );
}