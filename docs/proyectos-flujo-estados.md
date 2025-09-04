# Flujo de Estados de Proyectos

## Diagrama de Estados

```mermaid
stateDiagram-v2
    [*] --> aprobacion : Crear proyecto
    
    aprobacion --> publicado : Publicar con matching
    aprobacion --> cancelado : Cancelar
    
    publicado --> en_espera : Sin expertos disponibles
    publicado --> en_proceso : Asignar experto
    publicado --> cancelado : Cancelar
    
    en_espera --> publicado : Expertos disponibles
    en_espera --> cancelado : Cancelar
    
    en_proceso --> completado : Finalizar exitosamente
    en_proceso --> cancelado : Cancelar
    
    completado --> [*] : Estado final
    cancelado --> [*] : Estado final
```

## Descripción de Transiciones

### Desde `aprobacion`
- **→ `publicado`**: Proyecto aprobado y publicado con matching automático
- **→ `cancelado`**: Proyecto cancelado antes de publicación

### Desde `publicado`
- **→ `en_espera`**: No hay expertos disponibles para el matching
- **→ `en_proceso`**: Se asignó un experto al proyecto
- **→ `cancelado`**: Proyecto cancelado después de publicación

### Desde `en_espera`
- **→ `publicado`**: Expertos aprobados disponibles, re-publicar
- **→ `cancelado`**: Proyecto cancelado en espera

### Desde `en_proceso`
- **→ `completado`**: Proyecto finalizado exitosamente
- **→ `cancelado`**: Proyecto cancelado durante desarrollo

## Estados Finales
- **`completado`**: Proyecto terminado exitosamente
- **`cancelado`**: Proyecto cancelado por cualquier motivo

## Reglas de Negocio

1. **Solo el propietario** puede cambiar el estado de sus proyectos
2. **Estados finales** no pueden ser modificados
3. **Proyectos publicados** son visibles para expertos
4. **Matching automático** solo ocurre al publicar
5. **Fecha de publicación** se actualiza solo al cambiar a `publicado`
