"use client"

import { useState, useEffect, useRef } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { Star, Award, Briefcase, CheckCircle, TrendingUp, Shield, Target } from "lucide-react"
// import Image from "next/image"
import "../../scss/component-styles/Sec3.scss"

export default function Sec3() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)

  const careerPath = [
    {
      title: "Registro",
      description: "Crea tu perfil profesional y verifica tus credenciales para generar confianza.",
      icon: <Shield className="step-icon" />,
      stats: { servicios: 0, reseñas: 0, nivel: "Principiante" },
      benefits: ["Perfil verificado", "Acceso a la plataforma", "Visibilidad básica"],
    },
    {
      title: "Primeros Servicios",
      description: "Completa tus primeros trabajos y comienza a construir tu reputación profesional.",
      icon: <Briefcase className="step-icon" />,
      stats: { servicios: 5, reseñas: 3, nivel: "Iniciado" },
      benefits: ["Primeras reseñas", "Experiencia inicial", "Mejora de visibilidad"],
    },
    {
      title: "Reputación",
      description: "Acumula reseñas positivas y mejora tus habilidades con cada servicio.",
      icon: <Star className="step-icon" />,
      stats: { servicios: 15, reseñas: 12, nivel: "Intermedio" },
      benefits: ["Mayor visibilidad", "Mejores tarifas", "Clientes recurrentes"],
    },
    {
      title: "Destacado",
      description: "Destaca entre los mejores profesionales y accede a oportunidades premium.",
      icon: <Award className="step-icon" />,
      stats: { servicios: 30, reseñas: 25, nivel: "Avanzado" },
      benefits: ["Insignia de profesional destacado", "Prioridad en búsquedas", "Acceso a clientes premium"],
    },
    {
      title: "Experto",
      description: "Alcanza el nivel máximo de reconocimiento y expande tu negocio.",
      icon: <CheckCircle className="step-icon" />,
      stats: { servicios: 50, reseñas: 45, nivel: "Experto" },
      benefits: ["Tarifas premium", "Programa de referidos", "Oportunidades exclusivas"],
    },
  ]

  // Auto-advance through steps
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev < careerPath.length - 1 ? prev + 1 : 0))
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isVisible, careerPath.length])

  // Scroll timeline to active step on mobile
  useEffect(() => {
    const scrollTimelineToActiveStep = () => {
      if (window.innerWidth < 768 && timelineRef.current) {
        const timelineContainer = timelineRef.current.parentElement.parentElement
        const stepElements = timelineContainer.querySelectorAll(".timeline-step")
        if (stepElements[activeStep]) {
          const stepLeft = stepElements[activeStep].offsetLeft
          const containerWidth = timelineContainer.offsetWidth
          const scrollPosition = stepLeft - containerWidth / 2 + stepElements[activeStep].offsetWidth / 2

          timelineContainer.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          })
        }
      }
    }

    scrollTimelineToActiveStep()
  }, [activeStep])

  // Check if section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Update timeline progress
  useEffect(() => {
    if (timelineRef.current) {
      const progress = ((activeStep + 1) / careerPath.length) * 100
      timelineRef.current.style.width = `${progress}%`
    }
  }, [activeStep, careerPath.length])

  const handleStepClick = (index) => {
    setActiveStep(index)
  }

  return (
    <section className="sec3" id="progreso-profesional" ref={sectionRef}>
      <Container>
        <Row className="text-center mb-4">
          <Col>
            <h2 className="section-title">Tu Camino al Éxito Profesional</h2>
            <p className="section-subtitle">Descubre cómo ProXimidad impulsa tu crecimiento</p>
          </Col>
        </Row>

        {/* Timeline */}
        <Row className="career-path-container mb-4">
          <Col xs={12}>
            <div className="timeline-container">
              <div className="timeline-track">
                <div className="timeline-progress" ref={timelineRef}></div>
                {careerPath.map((step, index) => (
                  <div
                    key={index}
                    className={`timeline-step ${activeStep === index ? "active" : ""} ${
                      activeStep > index ? "completed" : ""
                    }`}
                    onClick={() => handleStepClick(index)}
                  >
                    <div className="step-marker">
                      <div className="step-icon-container">{step.icon}</div>
                    </div>
                    <div className="step-label">{step.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Career Stage Detail */}
        <Row className="career-stage-detail">
          <Col md={6} className="mb-4 mb-md-0">
            <div className={`career-stage-card ${isVisible ? "animate" : ""}`}>
              <div className="stage-header">
                <h3>{careerPath[activeStep].title}</h3>
                <div className="stage-level">
                  <Target size={18} />
                  <span>Nivel: {careerPath[activeStep].stats.nivel}</span>
                </div>
              </div>
              <p className="stage-description">{careerPath[activeStep].description}</p>

              <div className="stage-stats">
                <div className="stat-item">
                  <Briefcase size={18} />
                  <div className="stat-content">
                    <span className="stat-value">{careerPath[activeStep].stats.servicios}</span>
                    <span className="stat-label">Servicios</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Star size={18} />
                  <div className="stat-content">
                    <span className="stat-value">{careerPath[activeStep].stats.reseñas}</span>
                    <span className="stat-label">Reseñas</span>
                  </div>
                </div>
                <div className="stat-item">
                  <TrendingUp size={18} />
                  <div className="stat-content">
                    <span className="stat-value">{20 * (activeStep + 1)}%</span>
                    <span className="stat-label">Crecimiento</span>
                  </div>
                </div>
              </div>

              <div className="stage-benefits">
                <h4>Beneficios en esta etapa:</h4>
                <ul>
                  {careerPath[activeStep].benefits.map((benefit, index) => (
                    <li key={index}>
                      <CheckCircle size={16} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className={`career-visualization ${isVisible ? "animate" : ""}`}>
              <div className="visualization-header">
                <h3>Visualiza tu Progreso</h3>
                <p>Así es como crece tu perfil profesional</p>
              </div>

              <div className="profile-evolution">
                <div className="profile-card">
                  <div className="profile-header">
                    <div className="profile-avatar">
                      {/* <Image
                        src="/placeholder.svg?height=60&width=60"
                        alt="Perfil profesional"
                        width={60}
                        height={60}
                        className="rounded-circle"
                      /> */}
                    </div>
                    <div className="profile-info">
                      <h4>Tu Perfil Profesional</h4>
                      <div className="profile-badges">
                        {Array(activeStep + 1)
                          .fill()
                          .map((_, i) => (
                            <div key={i} className="badge-icon">
                              {i === 0 && <Shield size={16} />}
                              {i === 1 && <Briefcase size={16} />}
                              {i === 2 && <Star size={16} />}
                              {i === 3 && <Award size={16} />}
                              {i === 4 && <CheckCircle size={16} />}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="profile-metrics">
                    <div className="metric">
                      <div className="metric-label">Visibilidad</div>
                      <div className="metric-bar">
                        <div
                          className="metric-progress"
                          style={{ width: `${Math.min(20 + activeStep * 20, 100)}%` }}
                        ></div>
                      </div>
                      <div className="metric-value">{Math.min(20 + activeStep * 20, 100)}%</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Confianza</div>
                      <div className="metric-bar">
                        <div
                          className="metric-progress"
                          style={{ width: `${Math.min(15 + activeStep * 21, 100)}%` }}
                        ></div>
                      </div>
                      <div className="metric-value">{Math.min(15 + activeStep * 21, 100)}%</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Oportunidades</div>
                      <div className="metric-bar">
                        <div
                          className="metric-progress"
                          style={{ width: `${Math.min(10 + activeStep * 22, 100)}%` }}
                        ></div>
                      </div>
                      <div className="metric-value">{Math.min(10 + activeStep * 22, 100)}%</div>
                    </div>
                  </div>

                  <div className="profile-potential">
                    <div className="potential-icon">
                      <TrendingUp size={20} />
                    </div>
                    <div className="potential-info">
                      <div className="potential-label">Potencial de ingresos</div>
                      <div className="potential-value">
                        +{activeStep === 0 ? 0 : activeStep * 25}% vs. mercado tradicional
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Simplified CTA */}
        <Row className="simple-cta-container">
          <Col xs={12}>
            <div className={`simple-cta ${isVisible ? "animate" : ""}`}>
              <h3>Comienza tu camino al éxito profesional hoy</h3>
              <button className="cta-button">
                Registrarse Ahora
                <TrendingUp size={16} className="ms-2" />
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
