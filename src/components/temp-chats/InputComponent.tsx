import {useRef, useState} from 'react';
import {Send, Paperclip} from 'lucide-react';
import {Button} from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {MessageBodyType} from '@/hooks/temp-chats/useChattingEffect';
import showToast from '@/utils/show-toast';
import httpClient from '@/api-clients';
import {FileUploadApiResponse} from '@/types/api-responses';

export type PropType = {
  userId: string;
  displayName: string;
  sendMessage: (message: MessageBodyType) => void;
}

export default function InputComponent(props: PropType) {
  const [message, setMessage] = useState('');
  const inputFile = useRef<HTMLInputElement | null>(null);

  const sendHandler = () => {
    if (message.trim()) {
      props.sendMessage({ userId: props.userId, displayName: props.displayName, message, type: 'text' });
      setMessage('');
    }
  };

  const handleChange = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await httpClient.post<FileUploadApiResponse>({
          url: '/api/upload',
          params: { dir: 'temp-chats' },
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.statusCode === 200 && response.data!.uploadedFileName) {
          props.sendMessage({
            userId: props.userId,
            displayName: props.displayName,
            message: response.data!.uploadedFileName,
            type: 'file'
          });
        } else {
          showToast({
            content:'Failed to open file.',
            type: 'error'
          });
        }
      } catch (error: any) {
        showToast({
          content: `Error uploading file: ${error.message}`,
          type: 'error'
        });
      }
    } catch (e: any) {
      showToast({
        content:`Failed to open file. ${e.message}`,
        type: 'error'
      });
    }
  };

  return (
    <div id="chat-input">
      <Textarea
        className="mb-5"
        rows={3}
        style={{resize: 'none'}}
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button className="me-3"
        variant="default"
        onClick={sendHandler}>
        <Send/> Send
      </Button>
      <Button className="me-3"
        variant="secondary"
        onClick={() => inputFile.current && inputFile.current.click()}
        style={{borderTopRightRadius: '0', borderBottomRightRadius: '0.3rem'}}>
        <Paperclip/>
      </Button>
      <input type='file'
        id='openFileButtonInputField'
        ref={inputFile}
        onChange={handleChange}
        onClick={event => {
          (event.target as HTMLInputElement).value = '';
        }}
        style={{display: 'none'}}/>
    </div>
  );
}