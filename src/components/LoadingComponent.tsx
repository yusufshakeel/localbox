import BaseLayout from '@/layouts/BaseLayout';
import { Container, Spinner, Row, Col } from 'react-bootstrap';

export default function LoadingComponent() {
  return (
    <BaseLayout>
      <Container>
        <Row>
          <Col className="text-center">
            <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}