"use client"

import { useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import CircularProgress from "@mui/material/CircularProgress"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import { useAuth } from "../../Auth"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Swal from "sweetalert2"

const Iniciar = ({ onClose, onFormularioChange }) => {
  const [formData, setFormData] = useState({
    correo_electronico: "",
    codigo_verificacion: "",
  })

  const [loginMethod, setLoginMethod] = useState("code")
  const [errors, setErrors] = useState({})
  const [codeRequested, setCodeRequested] = useState(false)
  const [codeTimer, setCodeTimer] = useState(0)
  const navigate = useNavigate()

  const { loading, error, loginWithCode, generateCode } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.correo_electronico) {
      newErrors.correo_electronico = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = "Correo electrónico inválido"
    }

    if (loginMethod === "code" && !formData.codigo_verificacion && codeRequested) {
      newErrors.codigo_verificacion = "El código de verificación es requerido"
    }

    return newErrors
  }

  const handleGenerateCode = async () => {
    const formErrors = validateForm()
    if (formErrors.correo_electronico) {
      setErrors(formErrors)
      return
    }

    const result = await generateCode(formData.correo_electronico)

    if (result.success) {
      setCodeRequested(true)
      setCodeTimer(15)
      const interval = setInterval(() => {
        setCodeTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      Swal.fire({
        title: "Código Enviado",
        text: "Hemos enviado un código de verificación a tu correo electrónico. Por favor revisa tu bandeja de entrada.",
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#005187",
      })
    } else {
      setErrors({
        general: result.error || "Error al generar el código",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    let result

    if (loginMethod === "code") {
      result = await loginWithCode(formData)
    }

    if (result && result.success) {
      Swal.fire({
        title: "¡Inicio de sesión exitoso!",
        text: "Bienvenido de nuevo a ProXimidad.",
        icon: "success",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#005187",
      })
      onClose()
      navigate("/") // Redirect to home page
    } else {
      setErrors({
        general: result?.error || "Error en el inicio de sesión",
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="form-section">
      <motion.div
        className="form-container"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <div className="form-header">
          <h2>Inicio de Sesión</h2>
          <IconButton className="close-button" onClick={onClose} aria-label="cerrar">
            <CloseIcon />
          </IconButton>
        </div>

        <form className="formulario" onSubmit={handleSubmit}>
          <motion.div className="login-method-toggle" variants={itemVariants}>
            <button
              type="button"
              className={`method-btn ${loginMethod === "code" ? "active" : ""}`}
              onClick={() => setLoginMethod("code")}
            >
              Código de verificación
            </button>
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="correo_electronico">Correo Electrónico</label>
            <div className="input-with-icon">
              <EmailIcon className="input-icon" />
              <input
                id="correo_electronico"
                type="email"
                name="correo_electronico"
                value={formData.correo_electronico}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                disabled={loading}
                className={errors.correo_electronico ? "error-input" : ""}
              />
            </div>
            {errors.correo_electronico && <span className="error-message">{errors.correo_electronico}</span>}
          </motion.div>

          {loginMethod === "code" && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="codigo_verificacion">Código de Verificación</label>
                <div className="input-with-icon">
                  <LockIcon className="input-icon" />
                  <input
                    id="codigo_verificacion"
                    type="text"
                    name="codigo_verificacion"
                    value={formData.codigo_verificacion}
                    onChange={handleChange}
                    placeholder="Ingresa el código recibido"
                    disabled={loading || !codeRequested}
                    className={errors.codigo_verificacion ? "error-input" : ""}
                  />
                </div>
                {errors.codigo_verificacion && <span className="error-message">{errors.codigo_verificacion}</span>}
              </motion.div>

              <motion.div className="code-request-container" variants={itemVariants}>
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  disabled={loading || codeTimer > 0}
                  className="btn-generar"
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : codeTimer > 0 ? (
                    `Reenviar código (${codeTimer}s)`
                  ) : codeRequested ? (
                    "Reenviar código"
                  ) : (
                    "Generar código"
                  )}
                </button>
                {codeRequested && (
                  <p className="code-info">
                    Hemos enviado un código a tu correo electrónico. Si no lo encuentras, revisa tu carpeta de spam.
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}

          <motion.div className="form-buttons" variants={itemVariants}>
            <button
              type="submit"
              disabled={loading || (loginMethod === "code" && !codeRequested)}
              className="btn-submit"
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Iniciar Sesión"}
            </button>
          </motion.div>

          {errors.general && <div className="error-general">{errors.general}</div>}

          <motion.div className="form-footer" variants={itemVariants}>
            <p>¿No tienes cuenta?</p>
            <button type="button" onClick={() => onFormularioChange("registrar")} className="btn-switch">
              Regístrate
            </button>
          </motion.div>
        </form>
      </motion.div>
    </section>
  )
}

export default Iniciar
