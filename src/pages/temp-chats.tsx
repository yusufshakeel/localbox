import BaseLayout from '@/layouts/BaseLayout';
import {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS} from '@/configs/temp-chats';
import useChattingEffect from '@/hooks/temp-chats/useChattingEffect';
import ChatsComponent from '@/components/temp-chats/ChatsComponent';
import InputComponent from '@/components/temp-chats/InputComponent';
import {WithAuth} from '@/components/with-auth';
import {useSession} from 'next-auth/react';
import {PermissionsType} from '@/types/permissions';
import {Pages} from '@/configs/pages';

function TempChats() {
  const {data: session} = useSession() as any;
  const {messages, sendMessage} = useChattingEffect();

  const { user: { id: userId, displayName } } = session;

  return (
    <BaseLayout pageTitle="TempChats">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-12 lg:col-span-8 mb-10">
          <div id="chat-container">
            <ChatsComponent messages={messages} currentUserId={userId}/>
            <InputComponent userId={userId} displayName={displayName} sendMessage={sendMessage}/>
          </div>
        </div>
        <div className="col-span-12 md:col-span-12 lg:col-span-4 mb-10">
          <p className="font-bold">Info</p>
          <ul className="my-3 ml-6 list-disc [&>li]:mt-2">
            <li>Messages are automatically deleted
              after {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS / 60000} minutes.
            </li>
            <li>Files are automatically deleted
              after {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS / 60000} minutes.
            </li>
          </ul>
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(TempChats, {
  pageId: Pages.tempChats.id,
  permissions: [PermissionsType.AUTHORIZED_VIEW, PermissionsType.AUTHORIZED_USE]
});
