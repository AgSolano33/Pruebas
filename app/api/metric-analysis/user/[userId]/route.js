import { NextResponse } from "next/server";
import MetricAnalysisResult from "@/models/MetricAnalysisResult";
import { connectToDatabase } from "@/libs/mongodb";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "Falta userId" }, { status: 400 });
    }
    const analyses = await MetricAnalysisResult.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('proyectoId');
    return NextResponse.json({ success: true, analyses });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 