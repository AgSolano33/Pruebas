"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProviderServices() {
  const { data: session } = useSession();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
    categoria: ""
  });

  const categorias = [
    "Desarrollo Web", "Consultoría IT", "Marketing Digital", 
    "Diseño UX/UI", "Análisis de Datos", "Seguridad Informática",
    "Optimización SEO", "Redes Sociales", "E-commerce", "Otros"
  ];

  useEffect(() => {
    if (session?.user?.id) {
      fetchServices();
    }
  }, [session]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/expertos/services');
      const result = await response.json();
      
      if (result.success) {
        setServices(result.data || []);
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleAddService = async () => {
    if (!newService.nombre || !newService.descripcion) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/expertos/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Servicio agregado exitosamente');
        setNewService({
          nombre: "",
          descripcion: "",
          precio: "",
          duracion: "",
          categoria: ""
        });
        fetchServices();
      } else {
        toast.error(result.error || 'Error al agregar servicio');
      }
    } catch (error) {
      toast.error('Error al agregar servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (serviceId) => {
    const service = services.find(s => s._id === serviceId);
    if (!service) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/expertos/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Servicio actualizado exitosamente');
        setEditingService(null);
        fetchServices();
      } else {
        toast.error(result.error || 'Error al actualizar servicio');
      }
    } catch (error) {
      toast.error('Error al actualizar servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/expertos/services/${serviceId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Servicio eliminado exitosamente');
        fetchServices();
      } else {
        toast.error(result.error || 'Error al eliminar servicio');
      }
    } catch (error) {
      toast.error('Error al eliminar servicio');
    } finally {
      setLoading(false);
    }
  };

  const updateServiceField = (serviceId, field, value) => {
    setServices(prev => prev.map(service => 
      service._id === serviceId 
        ? { ...service, [field]: value }
        : service
    ));
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A3D7C] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Mis Servicios</h3>

        {/* Agregar Nuevo Servicio */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Servicio</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Servicio *
              </label>
              <input
                type="text"
                value={newService.nombre}
                onChange={(e) => setNewService({...newService, nombre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Desarrollo de Sitio Web"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={newService.categoria}
                onChange={(e) => setNewService({...newService, categoria: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (opcional)
              </label>
              <input
                type="text"
                value={newService.precio}
                onChange={(e) => setNewService({...newService, precio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: $500 - $1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (opcional)
              </label>
              <input
                type="text"
                value={newService.duracion}
                onChange={(e) => setNewService({...newService, duracion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 2-4 semanas"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={newService.descripcion}
                onChange={(e) => setNewService({...newService, descripcion: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe detalladamente el servicio que ofreces"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleAddService}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <FaPlus />
              )}
              Agregar Servicio
            </button>
          </div>
        </div>

        {/* Lista de Servicios */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Servicios Actuales</h4>
          
          {services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tienes servicios registrados aún.</p>
              <p className="text-sm">Agrega tu primer servicio arriba.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service._id} className="border border-gray-200 rounded-lg p-4">
                  {editingService === service._id ? (
                    // Modo edición
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Servicio
                          </label>
                          <input
                            type="text"
                            value={service.nombre}
                            onChange={(e) => updateServiceField(service._id, 'nombre', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría
                          </label>
                          <select
                            value={service.categoria}
                            onChange={(e) => updateServiceField(service._id, 'categoria', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Precio
                          </label>
                          <input
                            type="text"
                            value={service.precio}
                            onChange={(e) => updateServiceField(service._id, 'precio', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duración
                          </label>
                          <input
                            type="text"
                            value={service.duracion}
                            onChange={(e) => updateServiceField(service._id, 'duracion', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                          </label>
                          <textarea
                            value={service.descripcion}
                            onChange={(e) => updateServiceField(service._id, 'descripcion', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateService(service._id)}
                          disabled={loading}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            <FaSave />
                          )}
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <FaTimes />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualización
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-semibold text-gray-900 text-lg">{service.nombre}</h5>
                          {service.categoria && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {service.categoria}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingService(service._id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Editar servicio"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Eliminar servicio"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3">{service.descripcion}</p>

                      <div className="flex gap-4 text-sm text-gray-500">
                        {service.precio && (
                          <span>💰 {service.precio}</span>
                        )}
                        {service.duracion && (
                          <span>⏱️ {service.duracion}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 