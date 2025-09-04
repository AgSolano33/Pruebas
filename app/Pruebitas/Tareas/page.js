'use client';

import { useState } from 'react';

export default function TareasPage() {
  const [description, setDescription] = useState('Descripción de la tarea...');
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Usuario A', date: 'Hace 2 horas', text: '¡Excelente avance en esta tarea!' },
    { id: 2, author: 'Usuario B', date: 'Hace 1 hora', text: 'Necesitamos revisar los detalles del backend.' },
  ]);

  const predefinedComments = [
    '🎉 Tiene buena pinta !',
    '👋 ¿Necesitas ayuda ?',
    '⛔ Esto está bloqueado ...',
  ];

  const handleAddComment = () => {
    if (commentInput.trim()) {
      setComments([...comments, {
        id: comments.length + 1,
        author: 'Tú',
        date: 'Ahora',
        text: commentInput.trim(),
      }]);
      setCommentInput('');
    }
  };

  const handlePredefinedComment = (text) => {
    setCommentInput(text);
  };

  const handleEnviarComentario = () => {
    if (commentInput.trim()) {
      setComments([...comments, {
        id: comments.length + 1,
        author: 'Tú',
        date: 'Ahora',
        text: commentInput.trim(),
      }]);
      setCommentInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header moderno */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Regresar</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Tareas</h1>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Experto asignado</h3>
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
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Reasignar
                </button>
              </div>
            </div>

            {/* Descripción - Card moderno */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción de la tarea</h3>
              <textarea
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none transition-all duration-200"
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los detalles de la tarea..."
              ></textarea>
              
              {/* Botón Guardar Cambios */}
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => window.location.href = '/Pruebitas/Tareas/revisionEvi'}
                  className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 hover:opacity-90" 
                  style={{ backgroundColor: '#1a6fa6' }}
                >
                  Guardar cambios
                </button>
              </div>
            </div>

            {/* Input de comentario - Card moderno */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Comentario</h3>
              
              <div className="space-y-4">
                <textarea
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none transition-all duration-200"
                  rows="4"
                  placeholder="Escribe un comentario..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
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
                    onClick={handleEnviarComentario}
                    className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 hover:opacity-90"
                    style={{ backgroundColor: '#1a6fa6' }}
                  >
                    Enviar comentario
                  </button>
                </div>
              </div>
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
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {comment.author.charAt(0)}
                    </div>
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