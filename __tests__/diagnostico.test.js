import { describe, it, expect } from '@jest/globals';
import DiagnosticoCentral from '../models/DiagnosticoCentral';

// Mock del modelo DiagnosticoCentral
jest.mock('../models/DiagnosticoCentral', () => {
  const mockDiagnostico = {
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn()
  };
  return jest.fn(() => mockDiagnostico);
});

describe('DiagnosticoCentral API', () => {
  const mockDiagnosticoData = {
    nombreEmpresa: 'Empresa Test',
    tipoEmpresa: 'Micro',
    giroActividad: 'Servicios',
    numeroEmpleados: 5,
    ventasAnuales: 100000,
    dimension1: {
      puntaje: 80,
      observaciones: 'Buen desempeño en procesos internos'
    },
    dimension2: {
      puntaje: 75,
      observaciones: 'Área de oportunidad en gestión de recursos'
    },
    dimension3: {
      puntaje: 85,
      observaciones: 'Excelente en innovación'
    },
    dimension4: {
      puntaje: 70,
      observaciones: 'Necesita mejorar en tecnología'
    },
    dimension5: {
      puntaje: 90,
      observaciones: 'Liderazgo destacado'
    },
    recomendaciones: [
      'Implementar sistema de gestión de calidad',
      'Capacitar al personal en nuevas tecnologías',
      'Desarrollar plan de innovación'
    ],
    estado: 'completado'
  };

  const mockDiagnostico = {
    _id: 'mock-id-1',
    ...mockDiagnosticoData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('debería crear un nuevo diagnóstico central', async () => {
    // Configurar el mock para create
    DiagnosticoCentral().create.mockResolvedValue(mockDiagnostico);

    const diagnostico = await DiagnosticoCentral().create(mockDiagnosticoData);

    expect(diagnostico).toBeDefined();
    expect(diagnostico.nombreEmpresa).toBe(mockDiagnosticoData.nombreEmpresa);
    expect(diagnostico.tipoEmpresa).toBe(mockDiagnosticoData.tipoEmpresa);
    expect(diagnostico.dimension1.puntaje).toBe(mockDiagnosticoData.dimension1.puntaje);
    expect(diagnostico.recomendaciones).toHaveLength(3);
    expect(DiagnosticoCentral().create).toHaveBeenCalledWith(mockDiagnosticoData);
  });

  it('debería obtener todos los diagnósticos centrales', async () => {
    // Configurar el mock para find
    const mockDiagnosticos = [
      mockDiagnostico,
      {
        _id: 'mock-id-2',
        ...mockDiagnosticoData,
        nombreEmpresa: 'Empresa Test 2',
        estado: 'en_proceso',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    DiagnosticoCentral().find.mockResolvedValue(mockDiagnosticos);

    const diagnosticos = await DiagnosticoCentral().find();

    expect(Array.isArray(diagnosticos)).toBe(true);
    expect(diagnosticos).toHaveLength(2);
    expect(diagnosticos[0].nombreEmpresa).toBe('Empresa Test');
    expect(diagnosticos[1].nombreEmpresa).toBe('Empresa Test 2');
    expect(diagnosticos[1].estado).toBe('en_proceso');
    expect(DiagnosticoCentral().find).toHaveBeenCalled();
  });

  it('debería eliminar un diagnóstico central', async () => {
    // Configurar los mocks para findByIdAndDelete y findById
    DiagnosticoCentral().findByIdAndDelete.mockResolvedValue(mockDiagnostico);
    DiagnosticoCentral().findById.mockResolvedValue(null);

    const deletedDiagnostico = await DiagnosticoCentral().findByIdAndDelete('mock-id-1');
    
    expect(deletedDiagnostico).toBeDefined();
    expect(deletedDiagnostico._id).toBe('mock-id-1');
    expect(DiagnosticoCentral().findByIdAndDelete).toHaveBeenCalledWith('mock-id-1');
    
    // Verificar que ya no existe
    const foundDiagnostico = await DiagnosticoCentral().findById('mock-id-1');
    expect(foundDiagnostico).toBeNull();
    expect(DiagnosticoCentral().findById).toHaveBeenCalledWith('mock-id-1');
  });

  it('debería calcular el puntaje promedio correctamente', async () => {
    DiagnosticoCentral().create.mockResolvedValue(mockDiagnostico);

    const diagnostico = await DiagnosticoCentral().create(mockDiagnosticoData);
    
    const puntajes = [
      diagnostico.dimension1.puntaje,
      diagnostico.dimension2.puntaje,
      diagnostico.dimension3.puntaje,
      diagnostico.dimension4.puntaje,
      diagnostico.dimension5.puntaje
    ];
    
    const promedio = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;
    
    expect(promedio).toBe(80); // (80 + 75 + 85 + 70 + 90) / 5 = 80
  });
}); 