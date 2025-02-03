import Image from 'next/image';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dialog,
  DialogContent
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {MessageType} from '@/hooks/temp-chats/useChattingEffect';
import {getFilename} from '@/utils/filename';
import useWindowEffect from '@/hooks/useWindowEffect';
import {formatDate} from '@/utils/date';
import showToast from '@/utils/show-toast';
import httpClient from '@/api-clients';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {handleDownload} from '@/utils/download';
import {EllipsisVertical} from 'lucide-react';
import {FILE_EXTENSIONS} from '@/configs/files';
import path from 'path';
import {PublicFolders} from '@/configs/folders';
import {VideoPlayer} from '@/components/audio-video-player';

export type PropType = {
  messages: MessageType[];
  currentUserId: string;
}

export default function ChatsComponent(props: PropType) {
  const [open, setOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const messagesEndRef = useRef(null);
  const {viewportHeight} = useWindowEffect();
  const [chatContentHeight, setChatContentHeight] = useState<number>(300);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      // eslint-disable-next-line
      // @ts-ignore
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [props.messages]);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      const body = document.body;
      const paddingTop = parseFloat(window.getComputedStyle(body).paddingTop);
      const chatInput = document.getElementById('chat-input')?.offsetHeight ?? 0;
      const chatContent = viewportHeight - paddingTop - chatInput - 150;
      setChatContentHeight(chatContent);
    }
  }, [viewportHeight]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const response: any = await httpClient.get({
        url: '/api/profile',
        params: { userId }
      });
      if (response.statusCode === 200 && response.data) {
        setSelectedUserDetails(response.data.user);
        setOpen(true);
      }
      else {
        showToast({ content: response.message, type: 'error' });
      }
    } catch (error: any) {
      showToast({ content: error.message, type: 'error' });
    }
  };

  const closeDialog = () => {
    setSelectedUserDetails(null);
    setOpen(false);
  };

  return (
    <>
      <div
        ref={messagesEndRef}
        className="border rounded"
        style={{ padding: '10px', height: `${chatContentHeight}px`, overflowY: 'scroll' }}>
        {
          (props.messages || []).map((msg: MessageType, idx) => {
            const fileName = getFilename(msg.message);
            const message =
            msg.type === 'file'
              ? (
                <div className="mt-2 float-end">
                  <span className="me-3 text-sm">{fileName}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size="icon">
                        <EllipsisVertical/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload('temp-chats', msg.message)}>
                      Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
              : <span>{msg.message}</span>;

            let messagePreview: any = '';
            if (msg.type === 'file') {
              const fileExtension = path.extname(fileName).toLowerCase();

              if (FILE_EXTENSIONS.images.includes(fileExtension)) {
                messagePreview = (
                  <Image
                    width={200}
                    height={200}
                    priority
                    src={`/${PublicFolders.tempChats}/${encodeURIComponent(msg.message)}`}
                    className="my-2"
                    alt={fileName}/>
                );
              }
              else if (FILE_EXTENSIONS.videos.includes(fileExtension)) {
                messagePreview = (
                  <div key={msg.message}>
                    <VideoPlayer sources={[
                      { src: `/${PublicFolders.tempChats}/${encodeURIComponent(msg.message)}` }
                    ]}/>
                  </div>
                );
              } else if (FILE_EXTENSIONS.audios.includes(fileExtension)) {
                messagePreview = (
                  <audio controls key={msg.message}>
                    <source src={`/${PublicFolders.tempChats}/${encodeURIComponent(msg.message)}`}/>
                    Your browser does not support the audio tag.
                  </audio>
                );
              }
            }
            return (
              <div key={idx}
                style={{textAlign: msg.userId === props.currentUserId ? 'right' : 'left'}}>
                <div
                  className="border mb-3 p-2 rounded-md bg-gray-50 text-black"
                  style={{display: 'inline-block'}}>
                  <div className="mb-1">
                    <span className="cursor-pointer" onClick={() => fetchUserDetails(msg.userId)}>
                      <strong>{msg.displayName} </strong>
                    </span>
                    <span
                      className="float-end ms-3"> <small>{formatDate(msg.timestamp)}</small>
                    </span>
                  </div>
                  <div className="mb-1"
                    style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>
                    {messagePreview}
                    {message}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>

      {
        selectedUserDetails
        && (
          <Dialog open={open} onOpenChange={closeDialog}>
            <DialogContent aria-describedby={undefined}>
              <div className="flex flex-1">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{selectedUserDetails.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight px-2">
                  <p className="font-semibold">Username: {selectedUserDetails.username}</p>
                  <p className="text-xs">Display Name: {selectedUserDetails.displayName}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      }
    </>
  );
}