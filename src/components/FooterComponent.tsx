import {Container, Row, Col} from 'react-bootstrap';
import {WEBSITE_NAME} from '@/constants';
import useInfoEffect from '@/effects/useInfoEffect';

export default function FooterComponent() {
  const {info} = useInfoEffect();
  return (
    <Container>
      <Row className="mt-5">
        <Col className="text-center mt-5">
          <hr className="mt-5"/>
          <p>
            <a className="ys-a-link" href={info?.homepage}>{WEBSITE_NAME} GitHub repo</a>
            &nbsp; | &nbsp;
            <a className="ys-a-link" href={info?.licensePage}>License</a>
            &nbsp; | &nbsp;
            <span>Version {info?.version}</span>
          </p>
          <p>Created by Yusuf Shakeel</p>
        </Col>
      </Row>
    </Container>
  );
}