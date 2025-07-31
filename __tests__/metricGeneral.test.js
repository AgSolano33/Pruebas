import { analyzeGeneralMetrics, getGeneralAnalysis } from '../services/metricGeneralService';
import MetricGeneralAnalysis from '../models/MetricGeneralAnalysis';
import MetricAnalysisResult from '../models/MetricAnalysisResult';
import ProyectoPublicado from '../models/ProyectoPublicado';

// Mock de las dependencias
jest.mock('../libs/mongodb', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('../models/MetricGeneralAnalysis');
jest.mock('../models/MetricAnalysisResult');
jest.mock('../models/ProyectoPublicado');

describe('MetricGeneralService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeGeneralMetrics', () => {
    it('should analyze general metrics successfully', async () => {
      // Mock data
      const mockMetricasAnalizadas = [
        {
          metricKey: 'eficienciaOperativa',
          metricTitle: 'Eficiencia Operativa',
          valorPorcentual: 65,
          interpretacion: 'Interpretación de eficiencia operativa',
          conclusion: {
            nivel: 'Bueno',
            fortalezas: ['Procesos establecidos'],
            areasMejora: ['Automatización']
          },
          recomendaciones: ['Implementar automatización'],
          fechaAnalisis: new Date()
        }
      ];

      const mockAnalysis = {
        analisisGeneral: {
          resumenEjecutivo: 'Resumen ejecutivo de prueba',
          puntuacionGeneral: 70,
          patronesIdentificados: ['Patrón 1'],
          prioridadesEstrategicas: ['Prioridad 1']
        },
        conclusionesPorArea: {
          eficienciaOperativa: {
            interpretacion: 'Interpretación',
            conclusionGeneral: 'Conclusión general',
            fortalezas: ['Fortaleza 1'],
            areasMejora: ['Área 1']
          }
        },
        proyectosIntegrales: [
          {
            nombreProyecto: 'Proyecto Test',
            descripcionProyecto: 'Descripción del proyecto',
            metricasAbarcadas: ['eficienciaOperativa'],
            estimacionMejora: 20,
            areasInvolucradas: ['Operaciones'],
            expertosRequeridos: ['Consultor'],
            serviciosNecesarios: ['Servicio 1'],
            impactoEstrategico: 'Impacto alto',
            prioridad: 'Alta'
          }
        ],
        expertosRecomendados: [
          {
            perfilExperto: 'Consultor Test',
            especialidades: ['Especialidad 1'],
            metricasQueResuelve: ['eficienciaOperativa'],
            valorAgregado: 'Valor agregado',
            tipoServicio: 'Consultoría'
          }
        ],
        serviciosIntegrales: [
          {
            nombreServicio: 'Servicio Test',
            descripcionServicio: 'Descripción del servicio',
            metricasQueAborda: ['eficienciaOperativa'],
            beneficiosEsperados: ['Beneficio 1'],
            duracionEstimada: '6 meses',
            inversionEstimada: 'Mediana'
          }
        ],
        recomendacionesEstrategicas: ['Recomendación 1']
      };

      const mockProyecto = {
        _id: 'proyecto123',
        nombreProyecto: 'Proyecto Test'
      };

      // Mock de las funciones
      MetricAnalysisResult.find.mockResolvedValue(mockMetricasAnalizadas);
      ProyectoPublicado.create.mockResolvedValue(mockProyecto);
      MetricGeneralAnalysis.create.mockResolvedValue({
        _id: 'analysis123',
        ...mockAnalysis
      });

      // Mock de OpenAI (simulado)
      const mockOpenAIResponse = {
        choices: [{
          message: {
            content: JSON.stringify(mockAnalysis)
          }
        }]
      };

      // Simular la llamada a OpenAI
      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockOpenAIResponse)
          }
        }
      };

      // Mock del módulo OpenAI
      jest.doMock('openai', () => ({
        __esModule: true,
        default: jest.fn().mockImplementation(() => mockOpenAI)
      }));

      const result = await analyzeGeneralMetrics({
        userId: 'user123',
        empresa: {
          nombre: 'Empresa Test',
          sector: 'Tecnología',
          ubicacion: 'Madrid'
        }
      });

      expect(result).toBeDefined();
      expect(result.generalAnalysis).toBeDefined();
      expect(result.proyectosCreados).toHaveLength(1);
      expect(result.metricasAnalizadas).toBe(1);
    });

    it('should throw error when no metrics are found', async () => {
      MetricAnalysisResult.find.mockResolvedValue([]);

      await expect(analyzeGeneralMetrics({
        userId: 'user123',
        empresa: { nombre: 'Test' }
      })).rejects.toThrow('No se encontraron métricas analizadas para este usuario');
    });
  });

  describe('getGeneralAnalysis', () => {
    it('should get general analysis successfully', async () => {
      const mockAnalysis = {
        _id: 'analysis123',
        analisisGeneral: {
          resumenEjecutivo: 'Test resumen'
        }
      };

      MetricGeneralAnalysis.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockAnalysis)
        })
      });

      const result = await getGeneralAnalysis('user123');

      expect(result).toEqual(mockAnalysis);
    });
  });
}); 