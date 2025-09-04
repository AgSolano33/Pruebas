'use client';

import { useState } from 'react';

export default function RevisionEvidenciaPage() {
  const [evidenceComment, setEvidenceComment] = useState('');
  const [comments, setComments] = useState([
    { 
      id: 1, 
      author: 'Daniel Santiesteban', 
      date: '24 de julio de 2025, 15:13', 
      text: 'Esto es un ejemplo de como se vería un comentario postulado ya sea por el mismo experto, cliente o el mismo administrador de los proyectos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
  ]);

  const predefinedComments = [
    '🎉 Tiene buena pinta !',
    '👋 ¿Necesitas ayuda ?',
    '⛔ Esto está bloqueado ...',
  ];

  const handleAddEvidenceComment = () => {
    if (evidenceComment.trim()) {
      setComments([...comments, {
        id: comments.length + 1,
        author: 'Tú',
        date: 'Ahora',
        text: evidenceComment.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cfdfeeab?w=100&h=100&fit=crop&crop=face'
      }]);
      setEvidenceComment('');
    }
  };

  const handlePredefinedComment = (text) => {
    setEvidenceComment(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header moderno */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/Pruebitas/Tareas'}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Regresar</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Nombre de la tarea</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal - Contenido de la tarea */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experto asignado - Card moderno */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Experto Asignado</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#1a6fa6' }}>
                    A
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">alanerives08</h4>
                  <p className="text-sm text-gray-500">Experto en desarrollo</p>
                </div>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Asignarme a otro experto
                </a>
              </div>
            </div>

            {/* Evidencias de Tarea - Card moderno */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidencias de Tarea</h3>
              <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center">
                <div className="text-gray-500 text-lg mb-2">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg">Evidencias, fotos, texto, vídeo.</p>
                <p className="text-gray-400 text-sm mt-2">Arrastra archivos aquí o haz clic para seleccionar</p>
              </div>
            </div>

            {/* Añadir comentario de evidencia - Card moderno */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Añadir un comentario de evidencia</h3>
              
              <div className="space-y-4">
                <textarea
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none transition-all duration-200"
                  rows="3"
                  placeholder="Añadir un comentario de evidencia..."
                  value={evidenceComment}
                  onChange={(e) => setEvidenceComment(e.target.value)}
                ></textarea>
                
                {/* Comentarios predefinidos */}
                <div className="flex flex-wrap gap-2">
                  {predefinedComments.map((comment, index) => (
                    <button
                      key={index}
                      onClick={() => handlePredefinedComment(comment)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    >
                      {comment}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleAddEvidenceComment}
                    className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 hover:opacity-90"
                    style={{ backgroundColor: '#1a6fa6' }}
                  >
                    Enviar comentario
                  </button>
                </div>
              </div>
            </div>

            {/* Comentarios existentes */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-semibold text-gray-900">{comment.author}</p>
                        <p className="text-sm text-gray-500">{comment.date}</p>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha - Información relevante */}
          <div className="space-y-6">
            {/* Card de información */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información relevante</h3>
              <div className="space-y-4">
                {/* Fecha de entrega */}
                <div className="p-4 rounded-xl text-white" style={{ backgroundColor: '#1a6fa6' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">Fecha de entrega</p>
                  </div>
                  <p className="text-xl font-bold">01/02/2025</p>
                </div>

                {/* Estatus */}
                <div className="p-4 rounded-xl text-white" style={{ backgroundColor: '#1a6fa6' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">Estatus</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-yellow-900">
                    En proceso
                  </span>
                </div>

                {/* Prioridad */}
                <div className="p-4 rounded-xl text-white" style={{ backgroundColor: '#1a6fa6' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm font-medium">Prioridad</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
                    Alta
                  </span>
                </div>
              </div>
            </div>

            {/* Card de comentarios */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comentarios</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-gray-900 text-sm">{comment.author}</p>
                        <p className="text-xs text-gray-500">{comment.date}</p>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
