import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaCompass, FaMapSigns, FaHome, FaArrowLeft, FaEnvelope } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <section id="ErrorPage" className="error-page">
      <Container className="min-vh-100 d-flex flex-column justify-content-center text-center">
        <Row className="mb-4">
          <Col>
            <h1 className="display-1 font-weight-bold text-indigo mb-4">404</h1>
            <h2 className="h3 font-weight-semibold text-dark mb-4">Page Not Found</h2>
            <p className="text-muted mb-8">Sorry, the page you're looking for doesn't exist or has been moved.</p>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs={12} md={4}>
            <div className="icon-wrapper">
              <FaCompass className="icon" />
              <p className="text-muted">Lost Your Way?</p>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="icon-wrapper">
              <FaMapSigns className="icon" />
              <p className="text-muted">Need Directions?</p>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="icon-wrapper">
              <FaHome className="icon" />
              <p className="text-muted">Back to Safety</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="button-group">
              <Button href="/" className="btn-indigo">
                <FaArrowLeft className="mr-2" />
                Return Home
              </Button>
              <Button href='/contact' variant="outline-secondary" className="btn-contact">
                <FaEnvelope className="mr-2" />
                Contact Support
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ErrorPage;

