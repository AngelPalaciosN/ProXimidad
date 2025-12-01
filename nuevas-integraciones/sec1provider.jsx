"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { CheckCircle, FileText, Star, TrendingUp } from "lucide-react"

export default function Sec1Provider({ serviciosExitosos = 0, serviciosCreados = 0, calificacionGeneral = 0 }) {
  const [animatedValues, setAnimatedValues] = useState({
    exitosos: 0,
    creados: 0,
  })

  // Animación de conteo
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues({
        exitosos: Math.round(serviciosExitosos * easeOut),
        creados: Math.round(serviciosCreados * easeOut),
      })

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [serviciosExitosos, serviciosCreados])

  // Renderizar estrellas (1-5)
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="star-icon filled" size={24} fill="#FFD700" color="#FFD700" />)
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <span key={i} className="star-half-wrapper">
            <Star className="star-icon half-bg" size={24} color="#ddd" />
            <Star className="star-icon half-fill" size={24} fill="#FFD700" color="#FFD700" />
          </span>,
        )
      } else {
        stars.push(<Star key={i} className="star-icon empty" size={24} color="#ddd" />)
      }
    }
    return stars
  }

  // Calcular tasa de éxito
  const tasaExito = serviciosCreados > 0 ? Math.round((serviciosExitosos / serviciosCreados) * 100) : 0

  return (
    <section className="sec1 sec1-provider" id="panel-proveedor">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="display-5 fw-bold">Panel del Proveedor</h2>
          <p className="lead text-muted">Resumen de tu rendimiento y servicios</p>
        </div>

        <Row className="g-4">
          <Col lg={3} md={6}>
            <div className="metric-card" id="metric-exitosos">
              <div className="metric-icon">
                <CheckCircle size={40} />
              </div>
              <div className="metric-content">
                <span className="metric-value">{animatedValues.exitosos}</span>
                <h3 className="metric-label">Servicios Exitosos</h3>
                <p className="metric-description">Completados satisfactoriamente</p>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <div className="metric-card" id="metric-creados">
              <div className="metric-icon">
                <FileText size={40} />
              </div>
              <div className="metric-content">
                <span className="metric-value">{animatedValues.creados}</span>
                <h3 className="metric-label">Servicios Creados</h3>
                <p className="metric-description">Total de servicios ofrecidos</p>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <div className="metric-card" id="metric-rating">
              <div className="metric-icon">
                <Star size={40} />
              </div>
              <div className="metric-content">
                <div className="stars-container d-flex gap-1 mb-2">{renderStars(calificacionGeneral)}</div>
                <span className="metric-value rating-value">{calificacionGeneral.toFixed(1)}</span>
                <h3 className="metric-label">Calificación General</h3>
                <p className="metric-description">Promedio de tus clientes</p>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <div className="metric-card" id="metric-tasa">
              <div className="metric-icon">
                <TrendingUp size={40} />
              </div>
              <div className="metric-content">
                <span className="metric-value">
                  {tasaExito}
                  <span className="metric-suffix">%</span>
                </span>
                <h3 className="metric-label">Tasa de Éxito</h3>
                <p className="metric-description">Ratio de finalización</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
