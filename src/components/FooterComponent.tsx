import {Container, Row, Col} from 'react-bootstrap';
import {WEBSITE_NAME, YUSUF_SHAKEEL_WEBSITE_URL} from '@/constants';
import {useAppContext} from '@/context/AppContext';

export default function FooterComponent() {
  const appContext = useAppContext();
  return (
    <Container>
      <Row className="mt-5">
        <Col className="text-center mt-5">
          <hr className="mt-5"/>
          <p>
            <a className="ys-a-link" href={appContext.info?.homepage}>{WEBSITE_NAME}</a>
            &nbsp;&nbsp;
            <span>v{appContext.info?.version}</span>
          </p>
          <p>Created by <a className="ys-a-link" href={YUSUF_SHAKEEL_WEBSITE_URL}>Yusuf Shakeel</a></p>
        </Col>
      </Row>
    </Container>
  );
}