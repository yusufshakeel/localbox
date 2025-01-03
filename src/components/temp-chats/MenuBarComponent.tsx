import {Button} from '@/components/ui/button';

export type PropType = {
  isLoggedIn: boolean,
  displayName: string,
  logOut: () => void,
  logIn: () => void,
}

export default function MenuBarComponent(props: PropType) {
  const getHeaderContent = () => {
    if(props.isLoggedIn) {
      return (
        <div>
          <Button className="me-3"
            variant="secondary"
            onClick={props.logOut}>
            Log Out
          </Button>
          <span>
            <span className="ms-2"><strong>{props.displayName}</strong></span>
          </span>
        </div>
      );
    }

    return (
      <div>
        <Button className="me-3"
          variant="default"
          onClick={props.logIn}>
          Join Back
        </Button>
        <span>
          <span className="ms-2"><strong>{props.displayName}</strong>, you are currently logged out.</span>
        </span>
      </div>
    );
  };

  return (
    <>{getHeaderContent()}</>
  );
}