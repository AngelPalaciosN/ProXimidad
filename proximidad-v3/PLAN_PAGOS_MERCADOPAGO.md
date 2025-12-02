# 💰 Sistema de Pagos con Escrow - Mercado Pago

## 📋 Concepto del Sistema

### Flujo de Dinero Seguro
```
Cliente Paga → Dinero Retenido (Escrow) → Servicio Completado → 
Ambos Confirman → Dinero Liberado al Proveedor
```

---

## 🎯 Características Principales

### Para el Cliente
- ✅ Paga y su dinero queda **SEGURO** en Mercado Pago
- ✅ Solo se libera cuando **confirma** que el servicio está OK
- ✅ Puede ver estado del pago: "Retenido" → "Procesando" → "Liberado"
- ✅ Si hay problema, puede abrir disputa

### Para el Proveedor
- ✅ Ve cuánto dinero tiene "**en juego**" (retenido) por cada servicio
- ✅ Dashboard muestra: "Dinero pendiente de confirmación"
- ✅ Recibe notificación cuando cliente confirma
- ✅ Dinero se libera automáticamente a su cuenta

### Para la Plataforma (ProXimidad)
- ✅ Control total del flujo de pagos
- ✅ Retiene comisión antes de liberar al proveedor
- ✅ Sistema de disputas automático
- ✅ Auditoría completa de transacciones

---

## 💼 Modelo de Negocio

### Ejemplo de Transacción
```
Servicio: Desarrollo Web
Precio: $500,000 COP

1. Cliente paga: $500,000 → Mercado Pago (retenido)
2. Comisión ProXimidad: 10% = $50,000
3. Comisión Mercado Pago: 3.99% = $19,950
4. Proveedor recibirá: $430,050 (cuando se libere)
```

### Estados del Pago
```python
# Estado en tu base de datos
ESTADOS_PAGO = [
    ('pendiente', 'Esperando pago del cliente'),
    ('retenido', 'Dinero en escrow (seguro)'),
    ('en_revision', 'Servicio completado, esperando confirmación'),
    ('liberado', 'Dinero liberado al proveedor'),
    ('disputado', 'Cliente reportó problema'),
    ('cancelado', 'Servicio cancelado, reembolso al cliente'),
]
```

---

## 🏗️ Arquitectura del Sistema

### Base de Datos - Nueva Tabla `pagos`

```sql
CREATE TABLE `pagos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `servicio_id` bigint NOT NULL,
  `cliente_id` bigint NOT NULL,
  `proveedor_id` bigint NOT NULL,
  
  -- Montos
  `monto_total` decimal(10,2) NOT NULL,
  `comision_plataforma` decimal(10,2) NOT NULL,
  `comision_pasarela` decimal(10,2) NOT NULL,
  `monto_proveedor` decimal(10,2) NOT NULL,
  
  -- Mercado Pago
  `mp_payment_id` varchar(100) UNIQUE,
  `mp_preference_id` varchar(100),
  `mp_status` varchar(50),
  
  -- Estados
  `estado` varchar(20) NOT NULL DEFAULT 'pendiente',
  `fecha_pago` datetime(6) NULL,
  `fecha_liberacion` datetime(6) NULL,
  `fecha_confirmacion_cliente` datetime(6) NULL,
  `fecha_confirmacion_proveedor` datetime(6) NULL,
  
  -- Metadatos
  `metodo_pago` varchar(50),  -- PSE, tarjeta, Nequi
  `notas_cliente` text,
  `notas_proveedor` text,
  `razon_disputa` text,
  
  `fecha_creacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `fecha_actualizacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  
  PRIMARY KEY (`id`),
  KEY `idx_servicio_estado` (`servicio_id`, `estado`),
  KEY `idx_cliente_estado` (`cliente_id`, `estado`),
  KEY `idx_proveedor_estado` (`proveedor_id`, `estado`),
  KEY `idx_mp_payment` (`mp_payment_id`),
  
  CONSTRAINT `pagos_servicio_fk` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pagos_cliente_fk` FOREIGN KEY (`cliente_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pagos_proveedor_fk` FOREIGN KEY (`proveedor_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔧 Backend - Django

### 1. Modelo `Pago`

```python
# models.py
from django.db import models
from django.utils import timezone

class Pago(models.Model):
    ESTADOS = [
        ('pendiente', 'Esperando pago'),
        ('retenido', 'Dinero en escrow'),
        ('en_revision', 'Esperando confirmación'),
        ('liberado', 'Pago liberado al proveedor'),
        ('disputado', 'En disputa'),
        ('cancelado', 'Cancelado/Reembolsado'),
    ]
    
    # Relaciones
    servicio = models.ForeignKey('Servicios', on_delete=models.CASCADE, related_name='pagos')
    cliente = models.ForeignKey('Usuario', on_delete=models.CASCADE, related_name='pagos_realizados')
    proveedor = models.ForeignKey('Usuario', on_delete=models.CASCADE, related_name='pagos_recibidos')
    
    # Montos
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    comision_plataforma = models.DecimalField(max_digits=10, decimal_places=2)
    comision_pasarela = models.DecimalField(max_digits=10, decimal_places=2)
    monto_proveedor = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Mercado Pago
    mp_payment_id = models.CharField(max_length=100, unique=True, null=True)
    mp_preference_id = models.CharField(max_length=100, null=True)
    mp_status = models.CharField(max_length=50, null=True)
    
    # Estados
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha_pago = models.DateTimeField(null=True, blank=True)
    fecha_liberacion = models.DateTimeField(null=True, blank=True)
    fecha_confirmacion_cliente = models.DateTimeField(null=True, blank=True)
    fecha_confirmacion_proveedor = models.DateTimeField(null=True, blank=True)
    
    # Metadatos
    metodo_pago = models.CharField(max_length=50, null=True)
    notas_cliente = models.TextField(blank=True)
    notas_proveedor = models.TextField(blank=True)
    razon_disputa = models.TextField(blank=True)
    
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pagos'
        ordering = ['-fecha_creacion']
    
    @property
    def puede_liberarse(self):
        """Verifica si el pago puede ser liberado"""
        return (
            self.estado == 'en_revision' and
            self.fecha_confirmacion_cliente and
            self.fecha_confirmacion_proveedor
        )
    
    @property
    def dinero_en_juego(self):
        """Para mostrar al proveedor cuánto dinero tiene retenido"""
        if self.estado in ['retenido', 'en_revision']:
            return self.monto_proveedor
        return 0
    
    def __str__(self):
        return f"Pago #{self.id} - {self.servicio.nombre_servicio} - {self.estado}"
```

### 2. Views - Gestión de Pagos

```python
# views_pagos.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import mercadopago
from decimal import Decimal

# Configuración Mercado Pago
mp = mercadopago.SDK("TU_ACCESS_TOKEN")

@api_view(['POST'])
def crear_pago(request):
    """
    Cliente inicia el pago de un servicio
    POST /api/pagos/crear/
    Body: {
        "servicio_id": 123,
        "cliente_id": 456
    }
    """
    try:
        servicio = Servicios.objects.get(id=request.data['servicio_id'])
        cliente = Usuario.objects.get(id=request.data['cliente_id'])
        proveedor = servicio.proveedor
        
        # Calcular montos
        monto_total = servicio.precio_base
        comision_plataforma = monto_total * Decimal('0.10')  # 10% para ProXimidad
        comision_pasarela = monto_total * Decimal('0.0399')  # 3.99% Mercado Pago
        monto_proveedor = monto_total - comision_plataforma - comision_pasarela
        
        # Crear registro en BD
        pago = Pago.objects.create(
            servicio=servicio,
            cliente=cliente,
            proveedor=proveedor,
            monto_total=monto_total,
            comision_plataforma=comision_plataforma,
            comision_pasarela=comision_pasarela,
            monto_proveedor=monto_proveedor,
            estado='pendiente'
        )
        
        # Crear preferencia en Mercado Pago (con escrow)
        preference_data = {
            "items": [{
                "title": servicio.nombre_servicio,
                "quantity": 1,
                "unit_price": float(monto_total),
                "currency_id": "COP"
            }],
            "payer": {
                "email": cliente.correo_electronico,
                "name": cliente.nombre_completo
            },
            "back_urls": {
                "success": "https://tuapp.com/pago-exitoso",
                "failure": "https://tuapp.com/pago-fallido",
                "pending": "https://tuapp.com/pago-pendiente"
            },
            "notification_url": "https://tuapp.com/api/webhooks/mercadopago",
            "external_reference": str(pago.id),
            "auto_return": "approved",
            # 🔥 CLAVE: capture=False hace que el dinero quede retenido
            "payment_methods": {
                "installments": 1
            },
            "marketplace_fee": float(comision_plataforma),  # Tu comisión
            "capture": False  # 🔥 ESCROW: No capturar inmediatamente
        }
        
        preference = mp.preference().create(preference_data)
        
        # Guardar datos de Mercado Pago
        pago.mp_preference_id = preference["response"]["id"]
        pago.save()
        
        return Response({
            "pago_id": pago.id,
            "init_point": preference["response"]["init_point"],  # URL para pagar
            "preference_id": preference["response"]["id"],
            "monto_total": monto_total,
            "monto_proveedor": monto_proveedor
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def webhook_mercadopago(request):
    """
    Webhook para notificaciones de Mercado Pago
    POST /api/webhooks/mercadopago
    """
    try:
        data = request.data
        
        if data.get('type') == 'payment':
            payment_id = data['data']['id']
            
            # Consultar el pago en Mercado Pago
            payment_info = mp.payment().get(payment_id)
            payment = payment_info["response"]
            
            # Buscar el pago en tu BD
            pago = Pago.objects.get(id=payment['external_reference'])
            
            # Actualizar estado según Mercado Pago
            pago.mp_payment_id = str(payment_id)
            pago.mp_status = payment['status']
            
            if payment['status'] == 'approved':
                pago.estado = 'retenido'  # Dinero en escrow
                pago.fecha_pago = timezone.now()
                pago.metodo_pago = payment['payment_method_id']
                
                # 🔔 Notificar a ambas partes
                # TODO: Enviar email/push notification
                
            pago.save()
            
        return Response({'status': 'ok'})
        
    except Exception as e:
        logger.error(f"Error en webhook MP: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def confirmar_servicio_cliente(request, pago_id):
    """
    Cliente confirma que el servicio está OK
    POST /api/pagos/{pago_id}/confirmar-cliente/
    """
    try:
        pago = Pago.objects.get(id=pago_id)
        
        if pago.estado != 'retenido':
            return Response({'error': 'El pago no está en estado retenido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        pago.fecha_confirmacion_cliente = timezone.now()
        pago.estado = 'en_revision'
        pago.notas_cliente = request.data.get('notas', '')
        pago.save()
        
        # Si ambos confirmaron, liberar pago
        if pago.puede_liberarse:
            liberar_pago_a_proveedor(pago)
        
        return Response({
            'message': 'Confirmación registrada',
            'estado': pago.estado,
            'puede_liberarse': pago.puede_liberarse
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def confirmar_servicio_proveedor(request, pago_id):
    """
    Proveedor confirma que completó el servicio
    POST /api/pagos/{pago_id}/confirmar-proveedor/
    """
    try:
        pago = Pago.objects.get(id=pago_id)
        
        if pago.estado != 'retenido':
            return Response({'error': 'El pago no está en estado retenido'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        pago.fecha_confirmacion_proveedor = timezone.now()
        pago.estado = 'en_revision'
        pago.notas_proveedor = request.data.get('notas', '')
        pago.save()
        
        # Si ambos confirmaron, liberar pago
        if pago.puede_liberarse:
            liberar_pago_a_proveedor(pago)
        
        return Response({
            'message': 'Confirmación registrada',
            'estado': pago.estado,
            'puede_liberarse': pago.puede_liberarse
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def liberar_pago_a_proveedor(pago):
    """
    Libera el pago retenido al proveedor
    🔥 Esta es la función clave del escrow
    """
    try:
        # Capturar el pago en Mercado Pago (liberar del escrow)
        result = mp.payment().capture(pago.mp_payment_id)
        
        if result["status"] == 200:
            pago.estado = 'liberado'
            pago.fecha_liberacion = timezone.now()
            pago.save()
            
            # 🔔 Notificar al proveedor
            # TODO: Email/Push "Tu pago de $XXX ha sido liberado"
            
            logger.info(f"Pago #{pago.id} liberado exitosamente")
            return True
        else:
            logger.error(f"Error al liberar pago #{pago.id}: {result}")
            return False
            
    except Exception as e:
        logger.error(f"Excepción al liberar pago: {str(e)}")
        return False


@api_view(['GET'])
def dinero_en_juego_proveedor(request, proveedor_id):
    """
    Dashboard proveedor: ver cuánto dinero tiene retenido
    GET /api/pagos/proveedor/{proveedor_id}/en-juego/
    """
    try:
        pagos_retenidos = Pago.objects.filter(
            proveedor_id=proveedor_id,
            estado__in=['retenido', 'en_revision']
        )
        
        total_en_juego = sum([p.monto_proveedor for p in pagos_retenidos])
        
        return Response({
            'proveedor_id': proveedor_id,
            'dinero_en_juego': total_en_juego,
            'cantidad_pagos_pendientes': pagos_retenidos.count(),
            'detalle': [{
                'pago_id': p.id,
                'servicio': p.servicio.nombre_servicio,
                'monto': p.monto_proveedor,
                'estado': p.estado,
                'fecha_pago': p.fecha_pago,
                'confirmacion_cliente': bool(p.fecha_confirmacion_cliente),
                'confirmacion_proveedor': bool(p.fecha_confirmacion_proveedor)
            } for p in pagos_retenidos]
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

---

## 🎨 Frontend - React

### 1. Botón de Pago (Cliente)

```jsx
// PagarServicio.jsx
import { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

const PagarServicio = ({ servicio, clienteId }) => {
  const [loading, setLoading] = useState(false)
  
  const handlePagar = async () => {
    setLoading(true)
    
    try {
      const response = await axios.post('/api/pagos/crear/', {
        servicio_id: servicio.id,
        cliente_id: clienteId
      })
      
      // Mostrar resumen antes de redirigir
      const result = await Swal.fire({
        title: '💰 Resumen del Pago',
        html: `
          <div style="text-align: left;">
            <p><strong>Servicio:</strong> ${servicio.nombre_servicio}</p>
            <p><strong>Monto total:</strong> $${response.data.monto_total.toLocaleString()} COP</p>
            <p><strong>El proveedor recibirá:</strong> $${response.data.monto_proveedor.toLocaleString()} COP</p>
            <hr>
            <p style="color: #667eea;">
              ✅ Tu dinero estará <strong>seguro</strong> hasta que confirmes 
              que el servicio está completado.
            </p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Pagar con Mercado Pago',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      })
      
      if (result.isConfirmed) {
        // Redirigir a Mercado Pago
        window.location.href = response.data.init_point
      }
      
    } catch (error) {
      Swal.fire('Error', 'No se pudo procesar el pago', 'error')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button 
      onClick={handlePagar} 
      disabled={loading}
      className="btn-pagar-mercadopago"
    >
      {loading ? 'Procesando...' : '💳 Pagar Servicio'}
    </button>
  )
}
```

### 2. Dashboard Proveedor - Dinero en Juego

```jsx
// DineroEnJuego.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'

const DineroEnJuego = ({ proveedorId }) => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `/api/pagos/proveedor/${proveedorId}/en-juego/`
      )
      setData(response.data)
    }
    
    fetchData()
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [proveedorId])
  
  if (!data) return <div>Cargando...</div>
  
  return (
    <div className="dinero-en-juego-card">
      <h3>💰 Dinero en Juego</h3>
      <div className="monto-principal">
        ${data.dinero_en_juego.toLocaleString()} COP
      </div>
      <p className="texto-explicativo">
        Este dinero está <strong>retenido de forma segura</strong> hasta que 
        tú y el cliente confirmen que el servicio está completado.
      </p>
      
      <hr />
      
      <h4>📋 Pagos Pendientes ({data.cantidad_pagos_pendientes})</h4>
      {data.detalle.map(pago => (
        <div key={pago.pago_id} className="pago-item">
          <div className="pago-header">
            <span className="servicio-nombre">{pago.servicio}</span>
            <span className="monto">${pago.monto.toLocaleString()}</span>
          </div>
          <div className="confirmaciones">
            <span className={pago.confirmacion_proveedor ? 'confirmado' : 'pendiente'}>
              {pago.confirmacion_proveedor ? '✅' : '⏳'} Tu confirmación
            </span>
            <span className={pago.confirmacion_cliente ? 'confirmado' : 'pendiente'}>
              {pago.confirmacion_cliente ? '✅' : '⏳'} Cliente confirmó
            </span>
          </div>
          {pago.confirmacion_proveedor && pago.confirmacion_cliente && (
            <div className="liberacion-info">
              🎉 Pago en proceso de liberación
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

### 3. Confirmación de Servicio

```jsx
// ConfirmarServicio.jsx
import axios from 'axios'
import Swal from 'sweetalert2'

const ConfirmarServicio = ({ pagoId, esCliente }) => {
  const confirmar = async () => {
    const result = await Swal.fire({
      title: '¿Confirmas que el servicio está completado?',
      text: esCliente 
        ? 'Al confirmar, el dinero será liberado al proveedor'
        : 'Al confirmar, estás indicando que completaste el servicio',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'No, aún no'
    })
    
    if (result.isConfirmed) {
      try {
        const endpoint = esCliente 
          ? `/api/pagos/${pagoId}/confirmar-cliente/`
          : `/api/pagos/${pagoId}/confirmar-proveedor/`
        
        const response = await axios.post(endpoint)
        
        Swal.fire(
          '✅ Confirmado',
          response.data.puede_liberarse 
            ? 'El pago será liberado en breve'
            : 'Esperando confirmación de la otra parte',
          'success'
        )
      } catch (error) {
        Swal.fire('Error', 'No se pudo confirmar', 'error')
      }
    }
  }
  
  return (
    <button onClick={confirmar} className="btn-confirmar">
      ✅ Confirmar Servicio Completado
    </button>
  )
}
```

---

## 📱 URLs a Agregar

```python
# urls.py
from django.urls import path
from . import views_pagos

urlpatterns = [
    # ... tus urls existentes
    
    # Pagos
    path('pagos/crear/', views_pagos.crear_pago),
    path('pagos/<int:pago_id>/confirmar-cliente/', views_pagos.confirmar_servicio_cliente),
    path('pagos/<int:pago_id>/confirmar-proveedor/', views_pagos.confirmar_servicio_proveedor),
    path('pagos/proveedor/<int:proveedor_id>/en-juego/', views_pagos.dinero_en_juego_proveedor),
    
    # Webhook Mercado Pago
    path('webhooks/mercadopago/', views_pagos.webhook_mercadopago),
]
```

---

## 🎯 Plan de Implementación (Para Mañana)

### Fase 1: Setup (30 min)
1. ✅ Crear cuenta Mercado Pago Developers
2. ✅ Obtener credenciales (Access Token, Public Key)
3. ✅ Instalar SDK: `pip install mercadopago`

### Fase 2: Base de Datos (20 min)
4. ✅ Ejecutar SQL crear tabla `pagos`
5. ✅ Crear modelo Django `Pago`
6. ✅ Hacer migrations

### Fase 3: Backend (1 hora)
7. ✅ Implementar vista `crear_pago`
8. ✅ Implementar webhook Mercado Pago
9. ✅ Implementar confirmaciones cliente/proveedor
10. ✅ Implementar función `liberar_pago`
11. ✅ Vista `dinero_en_juego_proveedor`

### Fase 4: Frontend (1 hora)
12. ✅ Botón de pago en detalle de servicio
13. ✅ Dashboard "Dinero en Juego" para proveedores
14. ✅ Botones de confirmación para ambos

### Fase 5: Testing (30 min)
15. ✅ Probar pago completo (con tarjeta de prueba)
16. ✅ Verificar que dinero queda retenido
17. ✅ Probar confirmaciones
18. ✅ Verificar liberación automática

---

## 🔐 Credenciales de Prueba Mercado Pago

```javascript
// Tarjetas de prueba
const TARJETAS_PRUEBA = {
  visa: {
    numero: '4509 9535 6623 3704',
    cvv: '123',
    vencimiento: '11/25'
  },
  mastercard: {
    numero: '5031 7557 3453 0604',
    cvv: '123',
    vencimiento: '11/25'
  }
}

// Access Token de prueba (reemplazar con el real)
ACCESS_TOKEN_TEST = "TEST-1234567890-123456-abcdef123456"
PUBLIC_KEY_TEST = "TEST-abcdef123456-123456-1234567890"
```

---

## 💡 Notas Importantes

### Seguridad
- ✅ Nunca guardes claves en el código (usar variables de entorno)
- ✅ Webhook debe verificar firma de Mercado Pago
- ✅ Validar que usuario solo puede confirmar sus propios pagos

### Performance
- ✅ Webhook debe ser rápido (< 5 segundos)
- ✅ Usar tareas asíncronas (Celery) para liberar pagos
- ✅ Cache para dashboard de proveedor

### UX
- ✅ Mostrar tiempo estimado de liberación (ej: "24-48 horas")
- ✅ Notificaciones push cuando dinero es liberado
- ✅ Email de confirmación en cada paso

---

## 🚀 Ventajas de Este Sistema

1. ✅ **Confianza total**: Cliente paga sin miedo
2. ✅ **Seguridad garantizada**: Mercado Pago maneja el dinero
3. ✅ **Sin riesgo para proveedor**: Ve que hay dinero comprometido
4. ✅ **Disputas automáticas**: Si hay problema, Mercado Pago arbitra
5. ✅ **Escalable**: Puede manejar miles de transacciones
6. ✅ **Profesional**: Mismo sistema que usan marketplaces grandes

---

## 📊 Dashboard para Ti (Admin)

```python
# Vista adicional para administrador
@api_view(['GET'])
def estadisticas_pagos_admin(request):
    """Dashboard admin: ver todo el flujo de dinero"""
    return Response({
        'total_en_escrow': Pago.objects.filter(
            estado__in=['retenido', 'en_revision']
        ).aggregate(Sum('monto_total'))['monto_total__sum'] or 0,
        
        'comisiones_pendientes': Pago.objects.filter(
            estado='retenido'
        ).aggregate(Sum('comision_plataforma'))['comision_plataforma__sum'] or 0,
        
        'liberados_hoy': Pago.objects.filter(
            estado='liberado',
            fecha_liberacion__date=timezone.now().date()
        ).count(),
        
        'total_transaccionado': Pago.objects.filter(
            estado='liberado'
        ).aggregate(Sum('monto_total'))['monto_total__sum'] or 0
    })
```

---

**🎯 Con este sistema, ProXimidad será una plataforma de confianza total.** 

Los clientes pagarán sin miedo porque saben que su dinero está seguro, y los proveedores trabajarán tranquilos porque ven que el dinero está comprometido.

**¡Esto es el broche de oro! 🏆**
