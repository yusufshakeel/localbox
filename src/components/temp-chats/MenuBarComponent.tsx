import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {Button} from 'react-bootstrap';

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
        <>
          <span>
            <FontAwesomeIcon icon={faCircle} style={{color: 'green'}}/>
            <span className="ms-2"><strong>{props.displayName}</strong></span>
          </span>
          <Button
            className="float-end"
            size="sm"
            variant="light"
            onClick={props.logOut}>
            Log Out
          </Button>
        </>
      );
    }

    return (
      <>
        <span>
          <FontAwesomeIcon icon={faCircle} style={{color: 'red'}}/>
          <span className="ms-2"><strong>{props.displayName}</strong>, you are currently logged out.</span>
        </span>
        <Button
          variant="light"
          size="sm"
          className="float-end"
          onClick={props.logIn}>
          Join Back
        </Button>
      </>
    );
  };

  return (
    <>{getHeaderContent()}</>
  );
}