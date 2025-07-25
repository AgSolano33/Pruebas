"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaEye, FaBrain } from "react-icons/fa";

export default function ProviderServices() {
  const { data: session } = useSession();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showCategorization, setShowCategorization] = useState(null);

  // Datos de categorización
  const industriasDisponibles = [
    "Aerospace", "Automotive", "Semiconductors", "Circuit Boards Assembly", "Medical Devices",
    "Industrial Automation", "Logistics, freight and transport", "Agriculture industry", "Food & Beverages",
    "Health Services", "Pharmacy", "Beauty and personal care", "Mining & Extraction", "Metallurgy",
    "Metal mechanic", "E-commerce", "Digital marketing & branding", "ClimateTech & Sustainability",
    "Construction & Infrastructure", "Entrepreneurship & Innovation", "Retail", "Politics & Public Policy",
    "Education & STEM", "Safety, Security & Defense", "TI", "Software and Tech Development",
    "Artificial Intelligence and Big Data", "Process automation", "Tourism and hospitality",
    "Cultural Heritage Preservation", "Creative Industry & arts", "Livestock & fishing", "Oil and gas",
    "Toys and Entertainment", "Textile", "Plastics and Polymers", "Banking and Financial Services",
    "Insurance and Reinsurance", "Non-Profit Organizations (NGOs)", "Biotechnology and Life Sciences"
  ];

  const serviciosDisponibles = [
    "Desarrollo de Software", "Investigación, Data e Inteligencia", "UX/UI", "Digitalización de procesos",
    "Optimización de procesos", "Capacitación y formación", "Consultoría Legal", "Consultoría Financiera y Contable",
    "Consultoría de Ventas", "Consultoría Científica", "Marketing Digital", "Branding y Diseño",
    "Diseño y desarrollo de maquinaria", "Automatización Industrial", "Prototipado y diseño de producto",
    "Desarrollo de producto"
  ];

  const objetivosCliente = [
    "Quiero incrementar mis ventas", "Quiero automatizar mis procesos", "Quiero mejorar y bajar el costo de mi operación",
    "Quiero mejorar la satisfacción de mis clientes", "Quiero expandir mis operaciones",
    "Quiero implementar nuevas tecnologías", "Quiero desarrollar un producto o un servicio",
    "Quiero poder generar información de mi negocio/proyecto", "Quiero capacitarme"
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    moneda: "USD",
    tipoPrecio: "por_hora",
    tiempoEstimado: "",
    industriasServicio: [],
    categoriasServicio: [],
    objetivosCliente: []
  });

  useEffect(() => {
    fetchServicios();
  }, [session]);

  const fetchServicios = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch('/api/expertos/servicios');
      const result = await response.json();
      
      if (result.success) {
        setServicios(result.data || []);
      } else {
        console.error('Error al cargar servicios:', result.error);
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      moneda: "USD",
      tipoPrecio: "por_hora",
      tiempoEstimado: "",
      industriasServicio: [],
      categoriasServicio: [],
      objetivosCliente: []
    });
    setEditingService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.descripcion || !formData.precio) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      const serviceData = {
        ...formData,
        precio: parseFloat(formData.precio)
      };

      const url = editingService 
        ? `/api/expertos/servicios/${editingService._id}`
        : '/api/expertos/servicios';
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(editingService ? 'Servicio actualizado exitosamente' : 'Servicio creado exitosamente');
        setShowModal(false);
        resetForm();
        fetchServicios();
      } else {
        toast.error(result.error || 'Error al guardar servicio');
      }
    } catch (error) {
      toast.error('Error al guardar servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (servicio) => {
    setEditingService(servicio);
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio.toString(),
      moneda: servicio.moneda,
      tipoPrecio: servicio.tipoPrecio,
      tiempoEstimado: servicio.tiempoEstimado || "",
      industriasServicio: servicio.industriasServicio || [],
      categoriasServicio: servicio.categoriasServicio || [],
      objetivosCliente: servicio.objetivosCliente || []
    });
    setShowModal(true);
  };

  const handleDelete = async (servicioId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return;
    
    try {
      const response = await fetch(`/api/expertos/servicios/${servicioId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Servicio eliminado exitosamente');
        fetchServicios();
      } else {
        toast.error(result.error || 'Error al eliminar servicio');
      }
    } catch (error) {
      toast.error('Error al eliminar servicio');
    }
  };

  const handleCategorization = async (servicioId) => {
    try {
      const response = await fetch(`/api/expertos/servicios/${servicioId}/categorizar`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Categorización actualizada');
        fetchServicios();
      } else {
        toast.error(result.error || 'Error al categorizar servicio');
      }
    } catch (error) {
      toast.error('Error al categorizar servicio');
    }
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const formatPrice = (precio, moneda, tipoPrecio) => {
    const symbols = { USD: '$', EUR: '€', MXN: '$', COP: '$', ARS: '$', CLP: '$', PEN: 'S/', BRL: 'R$' };
    const types = { por_hora: '/hora', por_proyecto: '/proyecto', por_mes: '/mes' };
    return `${symbols[moneda] || moneda}${precio} ${types[tipoPrecio] || ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Servicios</h2>
          <p className="text-gray-600">Gestiona los servicios que ofreces a tus clientes</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="w-4 h-4" />
          <span>Agregar Servicio</span>
        </button>
      </div>

      {/* Lista de Servicios */}
      <div className="grid gap-6">
        {servicios.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes servicios registrados</h3>
            <p className="text-gray-600 mb-4">Comienza agregando tu primer servicio para que los clientes puedan encontrarte</p>
            <button
              onClick={openModal}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Crear mi primer servicio
            </button>
          </div>
        ) : (
          servicios.map((servicio, index) => (
            <div key={servicio._id || index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{servicio.nombre}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      servicio.estado === 'activo' ? 'bg-green-100 text-green-800' :
                      servicio.estado === 'inactivo' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {servicio.estado}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{servicio.descripcion}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="font-medium">{formatPrice(servicio.precio, servicio.moneda, servicio.tipoPrecio)}</span>
                    {servicio.tiempoEstimado && (
                      <span>• {servicio.tiempoEstimado}</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowCategorization(showCategorization === servicio._id ? null : servicio._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Ver categorización IA"
                  >
                    <FaBrain className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(servicio)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    title="Editar servicio"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(servicio._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Eliminar servicio"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Categorización IA */}
              {showCategorization === servicio._id && servicio.categorizacionIA && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <FaBrain className="w-4 h-4 mr-2" />
                    Categorización por IA
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Industrias Recomendadas</h5>
                      <div className="flex flex-wrap gap-1">
                        {servicio.categorizacionIA.industriasRecomendadas?.map((industria, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {industria}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Objetivos Compatibles</h5>
                      <div className="flex flex-wrap gap-1">
                        {servicio.categorizacionIA.objetivosCompatibles?.map((objetivo, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {objetivo}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Palabras Clave</h5>
                      <div className="flex flex-wrap gap-1">
                        {servicio.categorizacionIA.palabrasClave?.map((palabra, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            {palabra}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Score de Confianza</h5>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(servicio.categorizacionIA.scoreConfianza || 0) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-blue-800">
                          {Math.round((servicio.categorizacionIA.scoreConfianza || 0) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCategorization(servicio._id)}
                    className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Recategorizar con IA
                  </button>
                </div>
              )}

              {/* Tags del servicio */}
              <div className="mt-4 flex flex-wrap gap-2">
                {servicio.industriasServicio?.map((industria, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {industria}
                  </span>
                ))}
                {servicio.categoriasServicio?.map((categoria, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {categoria}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para Crear/Editar Servicio */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Servicio *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Desarrollo de Software Web"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiempo Estimado
                    </label>
                    <input
                      type="text"
                      value={formData.tiempoEstimado}
                      onChange={(e) => handleInputChange('tiempoEstimado', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 2-4 semanas"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del Servicio *
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe detalladamente qué incluye tu servicio, metodología, entregables..."
                    required
                  />
                </div>

                {/* Precios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio *
                    </label>
                    <input
                      type="number"
                      value={formData.precio}
                      onChange={(e) => handleInputChange('precio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Moneda
                    </label>
                    <select
                      value={formData.moneda}
                      onChange={(e) => handleInputChange('moneda', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="MXN">MXN</option>
                      <option value="COP">COP</option>
                      <option value="ARS">ARS</option>
                      <option value="CLP">CLP</option>
                      <option value="PEN">PEN</option>
                      <option value="BRL">BRL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Precio *
                    </label>
                    <select
                      value={formData.tipoPrecio}
                      onChange={(e) => handleInputChange('tipoPrecio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="por_hora">Por Hora</option>
                      <option value="por_proyecto">Por Proyecto</option>
                      <option value="por_mes">Por Mes</option>
                    </select>
                  </div>
                </div>

                {/* Industrias */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industrias a las que puedes dar servicio
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                    {industriasDisponibles.map((industria) => (
                      <label key={industria} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.industriasServicio.includes(industria)}
                          onChange={() => handleArrayChange('industriasServicio', industria)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{industria}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categorías de Servicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorías de Servicio
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                    {serviciosDisponibles.map((servicio) => (
                      <label key={servicio} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.categoriasServicio.includes(servicio)}
                          onChange={() => handleArrayChange('categoriasServicio', servicio)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{servicio}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Objetivos del Cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivos de Cliente a los que puedes contribuir
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                    {objetivosCliente.map((objetivo) => (
                      <label key={objetivo} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.objetivosCliente.includes(objetivo)}
                          onChange={() => handleArrayChange('objetivosCliente', objetivo)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{objetivo}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : (editingService ? 'Actualizar Servicio' : 'Crear Servicio')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 