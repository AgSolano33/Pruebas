# Sistema de Estados de Proyectos

## Descripción

El sistema de proyectos ha sido restructurado para incluir un flujo de estados más robusto que permite un mejor control del ciclo de vida de los proyectos.

## Estados Disponibles

### 1. `aprobacion` (Estado inicial)
- **Descripción**: Proyecto creado y en espera de aprobación para publicación
- **Transiciones permitidas**: `publicado`, `cancelado`
- **Características**: 
  - `publicado: false`
  - No visible para expertos
  - Puede ser editado libremente

### 2. `publicado`
- **Descripción**: Proyecto aprobado y visible para expertos
- **Transiciones permitidas**: `en_espera`, `en_proceso`, `cancelado`
- **Características**:
  - `publicado: true`
  - Visible para expertos
  - Se realiza matching automático con expertos
  - `fechaPublicacion` se actualiza

### 3. `en_espera`
- **Descripción**: Proyecto publicado pero sin expertos disponibles
- **Transiciones permitidas**: `publicado`, `cancelado`
- **Características**:
  - `publicado: true`
  - Visible para expertos
  - Esperando que se aprueben expertos

### 4. `en_proceso`
- **Descripción**: Proyecto en desarrollo con expertos asignados
- **Transiciones permitidas**: `completado`, `cancelado`
- **Características**:
  - `publicado: true`
  - Proyecto activo
  - Expertos trabajando en él

### 5. `completado`
- **Descripción**: Proyecto finalizado exitosamente
- **Transiciones permitidas**: Ninguna (estado final)
- **Características**:
  - `publicado: false`
  - No visible para expertos
  - Estado final positivo

### 6. `cancelado`
- **Descripción**: Proyecto cancelado por cualquier motivo
- **Transiciones permitidas**: Ninguna (estado final)
- **Características**:
  - `publicado: false`
  - No visible para expertos
  - Estado final negativo

## API Endpoints

### 1. Obtener Proyectos por Estado

```http
GET /api/assistant/ProyectosPre/[userId]?estado=publicado&limit=10
```

**Parámetros:**
- `userId` (requerido): ID del usuario
- `estado` (opcional): Filtrar por estado específico
- `publicado` (opcional): Filtrar por estado de publicación
- `limit` (opcional): Límite de resultados

### 2. Actualizar Estado de Proyecto

```http
PUT /api/assistant/ProyectosPre/[userId]
```

**Body:**
```json
{
  "proyectoId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "nuevoEstado": "publicado",
  "datosAdicionales": {
    "industria": "Tecnología",
    "presupuesto": "50000",
    "plazo": "3 meses"
  }
}
```

### 3. Publicar Proyecto con Matching

```http
POST /api/assistant/ProyectosPre/publicado
```

**Body:**
```json
{
  "proyectoId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "userId": "user123",
  "datosAdicionales": {
    "nombreEmpresa": "Mi Empresa",
    "industria": "Tecnología",
    "presupuesto": "50000",
    "plazo": "3 meses"
  }
}
```

### 4. Obtener Estadísticas

```http
GET /api/assistant/ProyectosPre/estadisticas?userId=user123
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "estadisticasPorEstado": [
      {
        "_id": "publicado",
        "count": 5,
        "proyectos": [...]
      }
    ],
    "resumen": {
      "totalProyectos": 10,
      "proyectosPublicados": 5,
      "proyectosActivos": 3,
      "proyectosCompletados": 2,
      "proyectosCancelados": 0
    },
    "proyectosRecientes": [...]
  }
}
```

## Flujo de Trabajo Recomendado

1. **Creación**: Los proyectos se crean en estado `aprobacion`
2. **Revisión**: El usuario revisa y edita el proyecto
3. **Publicación**: Se cambia a `publicado` usando el endpoint de publicación
4. **Matching**: Se realiza automáticamente el matching con expertos
5. **Desarrollo**: Se cambia a `en_proceso` cuando se asignan expertos
6. **Finalización**: Se cambia a `completado` o `cancelado`

## Campos Adicionales

El modelo ahora incluye campos adicionales para un mejor control:

- `industria`: Industria del proyecto
- `categoriasServicioBuscado`: Categorías de servicios buscados
- `objetivoEmpresa`: Objetivo específico de la empresa
- `presupuesto`: Presupuesto del proyecto
- `plazo`: Plazo estimado del proyecto
- `analisisOpenAI`: Análisis de matching con expertos
- `expertosInteresados`: Número de expertos interesados
- `matchesGenerados`: Número de matches generados
- `fechaPublicacion`: Fecha de publicación
- `fechaActualizacion`: Fecha de última actualización

## Consideraciones de Seguridad

- Solo el propietario del proyecto puede cambiar su estado
- Los proyectos en estado `completado` o `cancelado` no pueden ser modificados
- Los proyectos en estado `publicado` son visibles para expertos
- Se mantiene compatibilidad con el campo `publicado` existente
