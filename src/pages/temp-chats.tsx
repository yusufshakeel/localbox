import BaseLayout from '@/layouts/BaseLayout';
import useChattingEffect from '@/hooks/temp-chats/useChattingEffect';
import ChatsComponent from '@/components/temp-chats/ChatsComponent';
import InputComponent from '@/components/temp-chats/InputComponent';
import {WithAuth} from '@/components/with-auth';
import {useSession} from 'next-auth/react';
import {Pages} from '@/configs/pages';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';

function TempChats() {
  const {data: session} = useSession() as any;
  const {messages, sendMessage} = useChattingEffect();

  const { user: { id: userId, displayName } } = session;

  return (
    <BaseLayout pageTitle={Pages.tempChats.title}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-12 lg:col-span-8 mb-10">
          <div id="chat-container">
            {
              hasPermissions(
                session,
                [`${Pages.tempChats.id}:${PermissionsType.AUTHORIZED_VIEW}`]
              ) && <ChatsComponent messages={messages} currentUserId={userId}/>
            }
            {
              hasPermissions(
                session,
                [`${Pages.tempChats.id}:${PermissionsType.AUTHORIZED_USE}`]
              ) && <InputComponent userId={userId}
                displayName={displayName}
                sendMessage={sendMessage}/>
            }
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(TempChats, {
  permissions: Pages.tempChats.permissions
});
