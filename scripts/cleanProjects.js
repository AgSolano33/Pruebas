// Script para limpiar proyectos y crear proyectos de ejemplo
// Este script se puede ejecutar manualmente para limpiar la base de datos

const cleanProjects = async () => {
  try {
    // Conectar a MongoDB
    const { connectToDatabase } = require('../libs/mongodb');
    const mongoose = await connectToDatabase();
    
    // Importar el modelo
    const ProyectoPublicado = require('../models/ProyectoPublicado');
    
    // Eliminar todos los proyectos existentes
    const deleteResult = await ProyectoPublicado.deleteMany({});
    console.log(`Eliminados ${deleteResult.deletedCount} proyectos existentes`);
    
    // Crear proyectos de ejemplo "zpinn"
    const proyectosEjemplo = [
      {
        nombreEmpresa: "ZPinn Tech Solutions",
        nombreProyecto: "Desarrollo de Plataforma E-commerce",
        industria: "Tecnología",
        categoriasServicioBuscado: ["Servicios Digitales", "Soluciones personalizadas"],
        objetivoEmpresa: "Crear una plataforma de e-commerce moderna y escalable para venta de productos tecnológicos",
        analisisOpenAI: {
          match: "Proyecto de desarrollo web con alto potencial de crecimiento",
          industriaMejor: "Tecnología",
          puntuacionMatch: 85,
          razones: ["Requiere expertos en desarrollo web", "Necesita optimización de procesos"]
        },
        estado: "en_espera",
        matchesGenerados: 3,
        fechaPublicacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        nombreEmpresa: "ZPinn Consulting",
        nombreProyecto: "Optimización de Procesos Empresariales",
        industria: "Consultoría",
        categoriasServicioBuscado: ["Negocios", "Optimización de procesos"],
        objetivoEmpresa: "Mejorar la eficiencia operativa y reducir costos en procesos internos",
        analisisOpenAI: {
          match: "Proyecto de consultoría empresarial con enfoque en mejora continua",
          industriaMejor: "Consultoría",
          puntuacionMatch: 78,
          razones: ["Requiere expertos en gestión empresarial", "Necesita análisis de procesos"]
        },
        estado: "en_espera",
        matchesGenerados: 2,
        fechaPublicacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        nombreEmpresa: "ZPinn Research Lab",
        nombreProyecto: "Investigación en Inteligencia Artificial",
        industria: "Investigación",
        categoriasServicioBuscado: ["Investigación", "STEAM"],
        objetivoEmpresa: "Desarrollar algoritmos de IA para análisis predictivo en el sector financiero",
        analisisOpenAI: {
          match: "Proyecto de investigación avanzada en IA con aplicaciones prácticas",
          industriaMejor: "Investigación",
          puntuacionMatch: 92,
          razones: ["Requiere expertos en IA y machine learning", "Necesita investigación aplicada"]
        },
        estado: "en_espera",
        matchesGenerados: 4,
        fechaPublicacion: new Date(),
        fechaActualizacion: new Date()
      }
    ];
    
    // Insertar proyectos de ejemplo
    const insertResult = await ProyectoPublicado.insertMany(proyectosEjemplo);
    console.log(`Creados ${insertResult.length} proyectos de ejemplo ZPinn`);
    
    console.log('Limpieza y creación de proyectos completada exitosamente');
    
  } catch (error) {
    console.error('Error en la limpieza de proyectos:', error);
  }
};

// Exportar la función para uso manual
module.exports = { cleanProjects };

// Si se ejecuta directamente este archivo
if (require.main === module) {
  cleanProjects();
} 