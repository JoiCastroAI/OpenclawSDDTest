import { type FC } from 'react';
import { Alert, Container } from 'react-bootstrap';

const NotFound: FC = () => (
  <Container className="py-4">
    <Alert variant="warning">
      <Alert.Heading>Page Not Found</Alert.Heading>
      <p className="mb-0">The page you are looking for does not exist.</p>
    </Alert>
  </Container>
);

export default NotFound;
