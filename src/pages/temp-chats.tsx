import BaseLayout from '@/layouts/BaseLayout';
import {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS} from '@/configs/temp-chats';
import useChattingEffect from '@/hooks/temp-chats/useChattingEffect';
import ChatsComponent from '@/components/temp-chats/ChatsComponent';
import JoinChatComponent from '@/components/temp-chats/JoinChatComponent';
import useUserAccountEffect from '@/hooks/temp-chats/useUserAccountEffect';
import MenuBarComponent from '@/components/temp-chats/MenuBarComponent';
import InputComponent from '@/components/temp-chats/InputComponent';
import DeleteAccountModalComponent from '@/components/temp-chats/DeleteAccountModalComponent';
import {WithAuth} from '@/components/with-auth';

function TempChats() {
  const {messages, sendMessage} = useChattingEffect();
  const {
    displayName,
    setDisplayName,
    joinChat,
    logIn,
    logOut,
    isLoggedIn,
    userId,
    isProfileCreated,
    deleteAccount
  } = useUserAccountEffect();

  const messagesAreaComponent = () => {
    return (
      <div id="chat-container" className="border rounded-md p-3">
        <div id="chat-header" className="mb-3">
          <MenuBarComponent
            isLoggedIn={isLoggedIn}
            displayName={displayName}
            logOut={logOut}
            logIn={logIn}/>
        </div>
        <div>
          {
            isLoggedIn
            && (
              <>
                <ChatsComponent messages={messages} currentUserId={userId}/>
                <InputComponent userId={userId} displayName={displayName}
                  sendMessage={sendMessage}/>
              </>
            )
          }
        </div>
      </div>
    );
  };

  return (
    <BaseLayout pageTitle="TempChats">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-12 lg:col-span-8 mb-10">
          {
            !isProfileCreated
              ? <JoinChatComponent
                displayName={displayName}
                setDisplayName={setDisplayName}
                joinChat={joinChat}/>
              : messagesAreaComponent()
          }
        </div>
        <div className="col-span-12 md:col-span-12 lg:col-span-4 mb-10">
          <p className="font-bold">Info</p>
          <ul className="my-3 ml-6 list-disc [&>li]:mt-2">
            <li>Messages are automatically deleted
              after {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS / 60000} minutes.</li>
            <li>Files are automatically deleted
              after {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS / 60000} minutes.</li>
          </ul>
          {
            isLoggedIn && <DeleteAccountModalComponent deleteAccount={deleteAccount}/>
          }
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(TempChats);
