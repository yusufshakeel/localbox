import {Container, Row, Col} from 'react-bootstrap';
import {WEBSITE_NAME, YUSUF_SHAKEEL_WEBSITE_URL} from '@/constants';
import {useAppContext} from '@/context/AppContext';
import ToggleThemeComponent from '@/components/ToggleThemeComponent';

export default function FooterComponent() {
  const {info} = useAppContext();
  return (
    <Container>
      <Row className="mt-5">
        <Col className="text-center mt-5">
          <hr className="mt-5"/>
          <p>
            <a className="ys-a-link" href={info?.homepage}>{WEBSITE_NAME}</a>
            &nbsp;&nbsp;
            <span>v{info?.version}</span>
            &nbsp;&nbsp;
            <ToggleThemeComponent/>
          </p>
          <p>Created by <a className="ys-a-link" href={YUSUF_SHAKEEL_WEBSITE_URL}>Yusuf Shakeel</a></p>
        </Col>
      </Row>
    </Container>
  );
}