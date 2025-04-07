import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import '../../scss/component-styles/Sec3.scss';

export default function Sec3() {

  return (
    <section className="sec3">
      <Container>
        <div className='Sphre'>
        </div>
        <Container class="Proveedor">
              <Row className="justify-content-center">
                 <Col md={8}>
                    <h1>Proveedores</h1>

                  </Col>
              </Row>
          </Container>
        <div className='Sphre2'>
        </div>
        <Container>
              <Row className="justify-content-center">
                 <Col md={8}>
                    <h1>Proveedores</h1>

                  </Col>
              </Row>
          </Container>
      </Container>
    </section>
  );
}
