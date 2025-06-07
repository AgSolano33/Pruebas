import { describe, it, expect } from '@jest/globals';
import Prediagnostico from '../models/Prediagnostico';

// Mock del modelo Prediagnostico
jest.mock('../models/Prediagnostico', () => {
  const mockPrediagnostico = {
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn()
  };
  return jest.fn(() => mockPrediagnostico);
});

describe('Prediagnostico API', () => {
  const mockPrediagnosticoData = {
    nombre: 'Juan',
    apellido: 'Pérez',
    genero: 'Masculino',
    nivelEstudios: 'Licenciatura',
    tipoEmpresa: 'Micro',
    nombreEmpresaProyecto: 'Empresa Test',
    email: 'juan@test.com',
    telefono: 1234567890,
    giroActividad: 'Servicios',
    descripcionActividad: 'Servicios de consultoría',
    tieneEmpleados: 'si',
    numeroEmpleados: 5,
    ventasAnualesEstimadas: 100000,
    mayorObstaculo: 'Falta de capital',
    gestionDificultades: 'Búsqueda de financiamiento',
    buenResultadoMetrica: 'Aumento de ventas',
    objetivosAcciones: 'Expandir mercado',
    tipoAyuda: 'Financiamiento',
    disponibleInvertir: 'si'
  };

  const mockPrediagnostico = {
    _id: 'mock-id-1',
    ...mockPrediagnosticoData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('debería crear un nuevo prediagnóstico', async () => {
    // Configurar el mock para create
    Prediagnostico().create.mockResolvedValue(mockPrediagnostico);

    const prediagnostico = await Prediagnostico().create(mockPrediagnosticoData);

    expect(prediagnostico).toBeDefined();
    expect(prediagnostico.nombre).toBe(mockPrediagnosticoData.nombre);
    expect(prediagnostico.email).toBe(mockPrediagnosticoData.email);
    expect(prediagnostico.nombreEmpresaProyecto).toBe(mockPrediagnosticoData.nombreEmpresaProyecto);
    expect(Prediagnostico().create).toHaveBeenCalledWith(mockPrediagnosticoData);
  });

  it('debería obtener todos los prediagnósticos', async () => {
    // Configurar el mock para find
    const mockPrediagnosticos = [
      mockPrediagnostico,
      {
        _id: 'mock-id-2',
        ...mockPrediagnosticoData,
        nombre: 'María',
        email: 'maria@test.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    Prediagnostico().find.mockResolvedValue(mockPrediagnosticos);

    const prediagnosticos = await Prediagnostico().find();

    expect(Array.isArray(prediagnosticos)).toBe(true);
    expect(prediagnosticos).toHaveLength(2);
    expect(prediagnosticos[0].nombre).toBe('Juan');
    expect(prediagnosticos[1].nombre).toBe('María');
    expect(Prediagnostico().find).toHaveBeenCalled();
  });

  it('debería eliminar un prediagnóstico', async () => {
    // Configurar los mocks para findByIdAndDelete y findById
    Prediagnostico().findByIdAndDelete.mockResolvedValue(mockPrediagnostico);
    Prediagnostico().findById.mockResolvedValue(null);

    const deletedPrediagnostico = await Prediagnostico().findByIdAndDelete('mock-id-1');
    
    expect(deletedPrediagnostico).toBeDefined();
    expect(deletedPrediagnostico._id).toBe('mock-id-1');
    expect(Prediagnostico().findByIdAndDelete).toHaveBeenCalledWith('mock-id-1');
    
    // Verificar que ya no existe
    const foundPrediagnostico = await Prediagnostico().findById('mock-id-1');
    expect(foundPrediagnostico).toBeNull();
    expect(Prediagnostico().findById).toHaveBeenCalledWith('mock-id-1');
  });
}); 