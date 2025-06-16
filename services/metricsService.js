import DiagnosticoCentral from "@/models/DiagnosticoCentral";
import { connectToDatabase } from "@/libs/mongodb";

export async function getMetrics() {
  try {
    await connectToDatabase();
    const diagnosticos = await DiagnosticoCentral.find()
      .select('evaluacionAreas')
      .sort({ createdAt: -1 });

    if (!diagnosticos || diagnosticos.length === 0) {
      return {
        madurezDigital: 0,
        saludFinanciera: 0,
        eficienciaOperativa: 0
      };
    }

    // Calcular promedios de las métricas
    const metrics = diagnosticos.reduce((acc, diagnostico) => {
      const { evaluacionAreas } = diagnostico;
      
      // Madurez Digital
      const madurezDigital = Object.values(evaluacionAreas.madurezDigital).reduce((sum, val) => sum + val, 0) / 5;
      
      // Salud Financiera
      const saludFinanciera = Object.values(evaluacionAreas.saludFinanciera).reduce((sum, val) => sum + val, 0) / 5;
      
      // Eficiencia Operativa
      const eficienciaOperativa = Object.values(evaluacionAreas.eficienciaOperativa).reduce((sum, val) => sum + val, 0) / 5;

      return {
        madurezDigital: acc.madurezDigital + madurezDigital,
        saludFinanciera: acc.saludFinanciera + saludFinanciera,
        eficienciaOperativa: acc.eficienciaOperativa + eficienciaOperativa
      };
    }, {
      madurezDigital: 0,
      saludFinanciera: 0,
      eficienciaOperativa: 0
    });

    // Calcular promedios finales
    const totalDiagnosticos = diagnosticos.length;
    return {
      madurezDigital: Math.round(metrics.madurezDigital / totalDiagnosticos),
      saludFinanciera: Math.round(metrics.saludFinanciera / totalDiagnosticos),
      eficienciaOperativa: Math.round(metrics.eficienciaOperativa / totalDiagnosticos)
    };
  } catch (error) {
    console.error("Error al obtener métricas:", error);
    throw error;
  }
} 