import { type FC } from 'react';
import { Container, Spinner } from 'react-bootstrap';

const LoadingSpinner: FC = () => (
  <Container className="py-4 text-center">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Container>
);

export default LoadingSpinner;
