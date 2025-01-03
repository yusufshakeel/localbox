import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME_MAX_LENGTH} from '@/configs/temp-chats';

export type PropType = {
  displayName: string;
  setDisplayName: (displayName: string) => void;
  joinChat: () => void;
}

export default function JoinChatComponent(props: PropType) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Join Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input placeholder="Set your display name"
                value={props.displayName}
                onChange={(e) => props.setDisplayName(e.target.value.trim())}
                maxLength={TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME_MAX_LENGTH}
              />
              <p><small>This cannot be changed later.</small></p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="default" onClick={props.joinChat}>Join</Button>
      </CardFooter>
    </Card>
  );
}