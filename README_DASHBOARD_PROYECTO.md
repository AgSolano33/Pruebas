# Dashboard Individual de Proyecto - ZPinn

## 🎯 Funcionalidades Implementadas

### 1. **Sistema de Expertos desde `expertos.json`**
- ✅ Todos los expertos ahora se cargan desde el archivo `public/expertos.json`
- ✅ No se requiere conexión a base de datos de expertos
- ✅ Sistema de matching mejorado con los expertos reales

### 2. **Flujo de Aceptación Automática de Citas**
- ✅ Cuando se envía una solicitud de reunión, automáticamente se acepta (hardcodeado)
- ✅ El proyecto cambia de estado "en_espera" a "en_proceso"
- ✅ Se muestra notificación de aceptación

### 3. **Dashboard Individual del Proyecto**
- ✅ Modal completo con dashboard tipo Kanban
- ✅ Métricas de progreso del proyecto
- ✅ Lista de expertos asignados al proyecto
- ✅ Sistema de tareas con 3 columnas: Por Hacer, En Proceso, Terminadas
- ✅ Funcionalidad para agregar, mover y eliminar tareas
- ✅ Asignación de tareas a expertos específicos

### 4. **Limpieza de Proyectos**
- ✅ Botón para limpiar todos los proyectos existentes
- ✅ Creación automática de 3 proyectos de ejemplo ZPinn
- ✅ Proyectos con diferentes industrias y categorías

## 🚀 Cómo Usar

### Paso 1: Limpiar y Crear Proyectos de Ejemplo
1. Ve al dashboard principal
2. Navega a la pestaña "Proyectos"
3. Haz clic en el botón "Limpiar y Crear Proyectos ZPinn"
4. Confirma la acción

### Paso 2: Probar el Flujo de Citas
1. En la pestaña "Proyectos", verás los 3 proyectos ZPinn
2. Haz clic en "Ver expertos que hacen match" en cualquier proyecto
3. Selecciona un experto y haz clic en "Contactar Experto"
4. Completa el formulario de reunión
5. **Automáticamente se aceptará la cita** y el proyecto cambiará a "En Proceso"

### Paso 3: Acceder al Dashboard Individual
1. Una vez que el proyecto esté "En Proceso", aparecerá el botón "Dashboard del Proyecto"
2. Haz clic en el botón para abrir el dashboard individual
3. Verás:
   - Métricas de progreso
   - Lista de expertos asignados
   - Tablero Kanban con tareas
   - Botón para agregar nuevas tareas

### Paso 4: Gestionar Tareas
1. En el dashboard individual, haz clic en "Agregar Tarea"
2. Completa el formulario:
   - Título de la tarea
   - Descripción
   - Experto asignado (seleccionado de los expertos del proyecto)
   - Prioridad (Baja, Media, Alta)
   - Fecha límite
3. Las tareas se crean en la columna "Por Hacer"
4. Puedes mover tareas entre columnas usando los botones
5. Puedes eliminar tareas con el botón X

## 📊 Estructura del Dashboard Individual

### Métricas Principales
- **Progreso**: Porcentaje de tareas completadas
- **Total Tareas**: Número total de tareas en el proyecto
- **En Proceso**: Tareas actualmente en desarrollo
- **Expertos**: Número de expertos asignados

### Expertos Asignados
- Muestra los expertos que han aceptado citas para el proyecto
- Incluye información de especialidades y experiencia
- Se cargan desde `expertos.json`

### Tablero Kanban
- **Por Hacer**: Tareas pendientes
- **En Proceso**: Tareas en desarrollo
- **Terminadas**: Tareas completadas

## 🔧 Configuración Técnica

### Archivos Modificados/Creados
- `components/ProyectoDashboard.js` - Dashboard individual del proyecto
- `components/ProyectoContextMenu.js` - Aceptación automática de citas
- `components/ProyectosTablero.js` - Integración del dashboard
- `app/api/clean-projects/route.js` - Endpoint para limpiar proyectos
- `app/dashboard/page.js` - Botón de limpieza
- `scripts/cleanProjects.js` - Script de limpieza

### Dependencias
- Todos los expertos vienen de `public/expertos.json`
- No requiere conexión a base de datos de expertos
- Sistema de estados de proyecto: "en_espera" → "en_proceso" → "completado"

## 🎨 Características del MVP

### ✅ Implementado
- Dashboard individual modal
- Sistema de tareas tipo Kanban
- Asignación de tareas a expertos
- Métricas de progreso
- Aceptación automática de citas
- Cambio automático de estado
- Limpieza de proyectos
- Proyectos de ejemplo ZPinn

### 🔄 Flujo Completo
1. Proyecto en "en_espera"
2. Usuario contacta experto
3. Cita se acepta automáticamente
4. Proyecto cambia a "en_proceso"
5. Aparece botón "Dashboard del Proyecto"
6. Usuario puede gestionar tareas y ver progreso

## 🚨 Notas Importantes

- **Aceptación Automática**: Las citas se aceptan automáticamente (hardcodeado)
- **Expertos**: Se cargan desde `expertos.json`, no de base de datos
- **Proyectos**: Se pueden limpiar y recrear con el botón rojo
- **Tareas**: Se guardan en estado local del componente (no persistente)
- **Estados**: Los cambios de estado son simulados (no persisten en BD)

## 🔮 Próximos Pasos (Futuras Iteraciones)

- Persistencia de tareas en base de datos
- Notificaciones en tiempo real
- Reportes detallados de progreso
- Integración con calendario
- Sistema de comentarios en tareas
- Archivos adjuntos
- Métricas avanzadas 