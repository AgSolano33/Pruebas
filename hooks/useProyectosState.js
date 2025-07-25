import { useState, useEffect } from 'react';
import postulacionesStore from '@/libs/postulacionesStore';

export function useProyectosState(proyectosOriginales) {
  const [proyectos, setProyectos] = useState([]);

  const actualizarProyectos = () => {
    if (!proyectosOriginales || proyectosOriginales.length === 0) {
      setProyectos([]);
      return;
    }

    const proyectosConEstados = proyectosOriginales.map(proyecto => ({
      ...proyecto,
      estado: postulacionesStore.getEstadoProyecto(proyecto._id)
    }));
    setProyectos(proyectosConEstados);
  };

  useEffect(() => {
    actualizarProyectos();
  }, [proyectosOriginales]);

  useEffect(() => {
    if (!proyectosOriginales || proyectosOriginales.length === 0) return;

    const unsubscribe = postulacionesStore.subscribe(actualizarProyectos);
    return unsubscribe;
  }, [proyectosOriginales]);

  return proyectos;
} 