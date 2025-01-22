import {useRef, useState} from 'react';
import {Send, Paperclip} from 'lucide-react';
import {Button} from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {MessageBodyType} from '@/hooks/temp-chats/useChattingEffect';
import showToast from '@/utils/show-toast';
import httpClient from '@/api-clients';
import {FileUploadApiResponse} from '@/types/api-responses';
import {TEMP_CHATS_MESSAGE_MAX_LENGTH} from '@/configs/temp-chats';

export type PropType = {
  userId: string;
  displayName: string;
  sendMessage: (message: MessageBodyType) => void;
  allowedFileSizeInBytes?: number
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

      if (props.allowedFileSizeInBytes && file.size > props.allowedFileSizeInBytes) {
        showToast({
          content: `Cannot attach large files.`,
          type: 'error'
        });
        return;
      }

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
        } else if (response.statusCode >= 400 && response.message) {
          showToast({
            content: response.message,
            type: 'error'
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
      <div className="relative">
        <Textarea
          className="mb-2 resize-none pr-16"
          rows={3}
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={TEMP_CHATS_MESSAGE_MAX_LENGTH}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 pointer-events-none">
          {message.length}
        </div>
      </div>
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
        style={{display: 'none'}}
      />
    </div>
  );
}