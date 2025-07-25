import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import Experto from "@/models/Experto";
import { connectToDatabase } from "@/libs/mongodb";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = params;

    // Buscar el perfil del experto
    const experto = await Experto.findOne({ userId: session.user.id });
    if (!experto) {
      return NextResponse.json({ success: false, error: "Perfil de experto no encontrado" }, { status: 404 });
    }

    // Buscar el servicio específico
    const servicio = experto.servicios.id(id);
    if (!servicio) {
      return NextResponse.json({ success: false, error: "Servicio no encontrado" }, { status: 404 });
    }

    // Categorizar el servicio con IA
    const categorizacion = await categorizarServicioConIA(servicio);

    // Actualizar el servicio con la nueva categorización
    servicio.categorizacionIA = categorizacion;
    servicio.fechaActualizacion = new Date();

    await experto.save();

    return NextResponse.json({ 
      success: true, 
      data: categorizacion,
      message: "Servicio recategorizado exitosamente" 
    });

  } catch (error) {
    console.error('Error al recategorizar servicio:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 });
  }
}

// Función para categorizar servicio con IA
async function categorizarServicioConIA(servicio) {
  try {
    // Aquí implementarías la lógica de categorización con IA más avanzada
    // Por ahora, crearemos una categorización mejorada basada en el contenido
    
    const descripcion = servicio.descripcion.toLowerCase();
    const nombre = servicio.nombre.toLowerCase();
    
    // Análisis de palabras clave para determinar industrias
    const industriasRecomendadas = analizarIndustrias(descripcion, nombre);
    
    // Análisis de servicios relacionados
    const serviciosRelacionados = analizarServiciosRelacionados(descripcion, nombre);
    
    // Análisis de objetivos compatibles
    const objetivosCompatibles = analizarObjetivos(descripcion, nombre);
    
    // Determinar nivel de experiencia requerido
    const nivelExperienciaRequerido = determinarNivelExperiencia(descripcion, servicio.precio);
    
    // Extraer palabras clave
    const palabrasClave = extraerPalabrasClave(descripcion);
    
    // Calcular score de confianza
    const scoreConfianza = calcularScoreConfianza(servicio);

    return {
      industriasRecomendadas,
      serviciosRelacionados,
      objetivosCompatibles,
      nivelExperienciaRequerido,
      palabrasClave,
      scoreConfianza
    };

  } catch (error) {
    console.error('Error en categorización IA:', error);
    throw error;
  }
}

// Función para analizar industrias basadas en el contenido
function analizarIndustrias(descripcion, nombre) {
  const industrias = [];
  
  // Mapeo de palabras clave a industrias
  const mapeoIndustrias = {
    'software': ['Software and Tech Development', 'TI'],
    'web': ['Software and Tech Development', 'E-commerce'],
    'app': ['Software and Tech Development', 'E-commerce'],
    'digital': ['Digital marketing & branding', 'E-commerce'],
    'marketing': ['Digital marketing & branding', 'E-commerce'],
    'automation': ['Industrial Automation', 'Process automation'],
    'industrial': ['Industrial Automation', 'Manufacturing'],
    'manufacturing': ['Industrial Automation', 'Manufacturing'],
    'health': ['Health Services', 'Medical Devices'],
    'medical': ['Health Services', 'Medical Devices'],
    'pharma': ['Pharmacy', 'Health Services'],
    'finance': ['Banking and Financial Services', 'Insurance and Reinsurance'],
    'banking': ['Banking and Financial Services'],
    'insurance': ['Insurance and Reinsurance'],
    'education': ['Education & STEM'],
    'stem': ['Education & STEM'],
    'construction': ['Construction & Infrastructure'],
    'infrastructure': ['Construction & Infrastructure'],
    'retail': ['Retail', 'E-commerce'],
    'ecommerce': ['E-commerce', 'Retail'],
    'food': ['Food & Beverages'],
    'beverage': ['Food & Beverages'],
    'agriculture': ['Agriculture industry'],
    'farming': ['Agriculture industry'],
    'automotive': ['Automotive'],
    'aerospace': ['Aerospace'],
    'semiconductor': ['Semiconductors'],
    'biotech': ['Biotechnology and Life Sciences'],
    'biotechnology': ['Biotechnology and Life Sciences'],
    'sustainability': ['ClimateTech & Sustainability'],
    'climate': ['ClimateTech & Sustainability'],
    'creative': ['Creative Industry & arts'],
    'arts': ['Creative Industry & arts'],
    'tourism': ['Tourism and hospitality'],
    'hospitality': ['Tourism and hospitality'],
    'mining': ['Mining & Extraction'],
    'oil': ['Oil and gas'],
    'gas': ['Oil and gas'],
    'textile': ['Textile'],
    'plastic': ['Plastics and Polymers'],
    'polymer': ['Plastics and Polymers'],
    'toy': ['Toys and Entertainment'],
    'entertainment': ['Toys and Entertainment'],
    'security': ['Safety, Security & Defense'],
    'defense': ['Safety, Security & Defense'],
    'ai': ['Artificial Intelligence and Big Data'],
    'machine learning': ['Artificial Intelligence and Big Data'],
    'data': ['Artificial Intelligence and Big Data'],
    'logistics': ['Logistics, freight and transport'],
    'transport': ['Logistics, freight and transport'],
    'freight': ['Logistics, freight and transport']
  };

  // Buscar palabras clave en la descripción y nombre
  for (const [palabra, industriasRelacionadas] of Object.entries(mapeoIndustrias)) {
    if (descripcion.includes(palabra) || nombre.includes(palabra)) {
      industrias.push(...industriasRelacionadas);
    }
  }

  // Si no se encontraron industrias específicas, usar las seleccionadas manualmente
  if (industrias.length === 0 && servicio.industriasServicio) {
    return servicio.industriasServicio;
  }

  // Retornar industrias únicas (máximo 5)
  return [...new Set(industrias)].slice(0, 5);
}

// Función para analizar servicios relacionados
function analizarServiciosRelacionados(descripcion, nombre) {
  const servicios = [];
  
  const mapeoServicios = {
    'desarrollo': ['Desarrollo de Software'],
    'software': ['Desarrollo de Software'],
    'programación': ['Desarrollo de Software'],
    'coding': ['Desarrollo de Software'],
    'web': ['Desarrollo de Software', 'UX/UI'],
    'app': ['Desarrollo de Software'],
    'mobile': ['Desarrollo de Software'],
    'data': ['Investigación, Data e Inteligencia'],
    'inteligencia': ['Investigación, Data e Inteligencia'],
    'analytics': ['Investigación, Data e Inteligencia'],
    'ux': ['UX/UI'],
    'ui': ['UX/UI'],
    'diseño': ['UX/UI', 'Branding y Diseño'],
    'user experience': ['UX/UI'],
    'digitalización': ['Digitalización de procesos'],
    'procesos': ['Digitalización de procesos', 'Optimización de procesos'],
    'optimización': ['Optimización de procesos'],
    'eficiencia': ['Optimización de procesos'],
    'capacitación': ['Capacitación y formación'],
    'formación': ['Capacitación y formación'],
    'training': ['Capacitación y formación'],
    'legal': ['Consultoría Legal'],
    'financiera': ['Consultoría Financiera y Contable'],
    'contable': ['Consultoría Financiera y Contable'],
    'finanzas': ['Consultoría Financiera y Contable'],
    'ventas': ['Consultoría de Ventas'],
    'sales': ['Consultoría de Ventas'],
    'científica': ['Consultoría Científica'],
    'research': ['Consultoría Científica'],
    'marketing': ['Marketing Digital'],
    'branding': ['Branding y Diseño'],
    'maquinaria': ['Diseño y desarrollo de maquinaria'],
    'máquina': ['Diseño y desarrollo de maquinaria'],
    'automatización': ['Automatización Industrial'],
    'industrial': ['Automatización Industrial'],
    'prototipo': ['Prototipado y diseño de producto'],
    'producto': ['Desarrollo de producto', 'Prototipado y diseño de producto']
  };

  for (const [palabra, serviciosRelacionados] of Object.entries(mapeoServicios)) {
    if (descripcion.includes(palabra) || nombre.includes(palabra)) {
      servicios.push(...serviciosRelacionados);
    }
  }

  // Si no se encontraron servicios específicos, usar las categorías seleccionadas manualmente
  if (servicios.length === 0 && servicio.categoriasServicio) {
    return servicio.categoriasServicio;
  }

  return [...new Set(servicios)].slice(0, 5);
}

// Función para analizar objetivos compatibles
function analizarObjetivos(descripcion, nombre) {
  const objetivos = [];
  
  const mapeoObjetivos = {
    'ventas': ['Quiero incrementar mis ventas'],
    'incrementar': ['Quiero incrementar mis ventas'],
    'automatizar': ['Quiero automatizar mis procesos'],
    'procesos': ['Quiero automatizar mis procesos'],
    'costo': ['Quiero mejorar y bajar el costo de mi operación'],
    'operación': ['Quiero mejorar y bajar el costo de mi operación'],
    'eficiencia': ['Quiero mejorar y bajar el costo de mi operación'],
    'satisfacción': ['Quiero mejorar la satisfacción de mis clientes'],
    'clientes': ['Quiero mejorar la satisfacción de mis clientes'],
    'expandir': ['Quiero expandir mis operaciones'],
    'crecer': ['Quiero expandir mis operaciones'],
    'tecnología': ['Quiero implementar nuevas tecnologías'],
    'innovación': ['Quiero implementar nuevas tecnologías'],
    'producto': ['Quiero desarrollar un producto o un servicio'],
    'servicio': ['Quiero desarrollar un producto o un servicio'],
    'información': ['Quiero poder generar información de mi negocio/proyecto'],
    'datos': ['Quiero poder generar información de mi negocio/proyecto'],
    'capacitación': ['Quiero capacitarme'],
    'formación': ['Quiero capacitarme'],
    'training': ['Quiero capacitarme']
  };

  for (const [palabra, objetivosRelacionados] of Object.entries(mapeoObjetivos)) {
    if (descripcion.includes(palabra) || nombre.includes(palabra)) {
      objetivos.push(...objetivosRelacionados);
    }
  }

  // Si no se encontraron objetivos específicos, usar los seleccionados manualmente
  if (objetivos.length === 0 && servicio.objetivosCliente) {
    return servicio.objetivosCliente;
  }

  return [...new Set(objetivos)].slice(0, 5);
}

// Función para determinar nivel de experiencia
function determinarNivelExperiencia(descripcion, precio) {
  const descripcionLower = descripcion.toLowerCase();
  
  // Palabras que indican experiencia senior
  const seniorKeywords = ['senior', 'experto', 'especialista', 'líder', 'manager', 'director', 'consultor'];
  const seniorFound = seniorKeywords.some(keyword => descripcionLower.includes(keyword));
  
  // Palabras que indican experiencia junior
  const juniorKeywords = ['junior', 'trainee', 'aprendiz', 'estudiante', 'primeros pasos'];
  const juniorFound = juniorKeywords.some(keyword => descripcionLower.includes(keyword));
  
  // Análisis de precio (precios altos suelen indicar experiencia senior)
  const precioNum = parseFloat(precio);
  const precioAlto = precioNum > 100; // Más de $100 por hora
  
  if (seniorFound || precioAlto) {
    return 'senior';
  } else if (juniorFound) {
    return 'junior';
  } else {
    return 'mid-level';
  }
}

// Función para extraer palabras clave
function extraerPalabrasClave(descripcion) {
  const palabrasComunes = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como', 'pero', 'sus', 'me', 'hasta', 'hay', 'donde', 'han', 'quien', 'están', 'estado', 'desde', 'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese', 'eso', 'ante', 'ellos', 'e', 'esto', 'mí', 'antes', 'algunos', 'qué', 'unos', 'yo', 'otro', 'otras', 'otra', 'él', 'tanto', 'esa', 'estos', 'mucho', 'quienes', 'nada', 'muchos', 'cual', 'poco', 'ella', 'estar', 'estas', 'algunas', 'algo', 'nosotros'];
  
  const palabras = descripcion.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(palabra => palabra.length > 3 && !palabrasComunes.includes(palabra));
  
  return [...new Set(palabras)].slice(0, 10);
}

// Función para calcular score de confianza
function calcularScoreConfianza(servicio) {
  let score = 0.5; // Score base
  
  // Aumentar score si tiene descripción detallada
  if (servicio.descripcion && servicio.descripcion.length > 100) {
    score += 0.1;
  }
  
  // Aumentar score si tiene industrias seleccionadas
  if (servicio.industriasServicio && servicio.industriasServicio.length > 0) {
    score += 0.1;
  }
  
  // Aumentar score si tiene categorías seleccionadas
  if (servicio.categoriasServicio && servicio.categoriasServicio.length > 0) {
    score += 0.1;
  }
  
  // Aumentar score si tiene objetivos seleccionados
  if (servicio.objetivosCliente && servicio.objetivosCliente.length > 0) {
    score += 0.1;
  }
  
  // Aumentar score si tiene precio definido
  if (servicio.precio && servicio.precio > 0) {
    score += 0.1;
  }
  
  return Math.min(score, 1.0); // Máximo 1.0
} 