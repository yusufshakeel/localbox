import {Container, Row, Col} from 'react-bootstrap';
import {WEBSITE_NAME} from '@/constants';

export default function FooterComponent() {
  return (
    <Container>
      <Row className="mt-5">
        <Col className="text-center mt-5">
          <hr className="mt-5"/>
          <p><a className="ys-a-link" href="https://github.com/yusufshakeel/localbox">{WEBSITE_NAME} GitHub repo</a></p>
          <p>Created by Yusuf Shakeel</p>
        </Col>
      </Row>
    </Container>
  );
}