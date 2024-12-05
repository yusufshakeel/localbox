import {Container, Row, Col} from 'react-bootstrap';

export default function FooterComponent() {
  return (
    <Container>
      <Row className="mt-5">
        <Col className="text-center mt-5">
          <hr className="mt-5"/>
          <p><a className="ys-a-link" href="https://github.com/yusufshakeel/localbox">GitHub</a></p>
        </Col>
      </Row>
    </Container>
  );
}