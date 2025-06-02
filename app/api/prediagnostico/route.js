import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb"; 
import Prediagnostico from "@/models/Prediagnostico"; 

export async function POST(request) {
  try {
    await connectDB(); 
    const data = await request.json(); 
    
   
    const prediagnostico = await Prediagnostico.create(data);
    

    return NextResponse.json(prediagnostico, { status: 201 });

  } catch (error) {
    console.error("Error saving prediagnostico data:", error);
    
    let errorMessage = "Error al guardar los datos del prediagnóstico";
    
  
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      errorMessage = `Error de validación: ${validationErrors.join(', ')}`;
    } else if (error.code === 11000) {
      errorMessage = "Datos duplicados: Ya existe un prediagnóstico con esta información.";
    } else if (error.name === 'CastError') {
      errorMessage = `Error de formato de datos: ${error.message}`;
    }

  
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

